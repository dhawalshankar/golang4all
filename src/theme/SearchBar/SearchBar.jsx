import React, { useCallback, useEffect, useRef, useState, } from "react";
import clsx from "clsx";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useIsBrowser from "@docusaurus/useIsBrowser";
import { useHistory, useLocation } from "@docusaurus/router";
import { translate } from "@docusaurus/Translate";
import { useActivePlugin, useActiveVersion, } from "@docusaurus/plugin-content-docs/client";
import { fetchIndexesByWorker, searchByWorker } from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/searchByWorker";
import { SuggestionTemplate } from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/SuggestionTemplate";
import { EmptyTemplate } from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/EmptyTemplate";
import { SearchDocumentType } from "@easyops-cn/docusaurus-search-local/dist/client/shared/interfaces";
import { Mark, searchBarShortcut, searchBarShortcutHint, searchBarShortcutKeymap, searchBarPosition, docsPluginIdForPreferredVersion, searchContextByPaths, hideSearchBarWithNoSearchContext, useAllContextsWithNoSearchContext, askAi, } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGenerated";
import LoadingRing from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/LoadingRing/LoadingRing";
import { normalizeContextByPath } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/normalizeContextByPath";
import { searchResultLimits } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/proxiedGeneratedConstants";
import { parseKeymap, matchesKeymap, getKeymapHints } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/keymap";
import { isMacPlatform } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/platform";
import { escapeHtml } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/escapeHtml";
import { highlight } from "@easyops-cn/docusaurus-search-local/dist/client/client/utils/highlight";
import { iconAction, iconContent } from "@easyops-cn/docusaurus-search-local/dist/client/client/theme/SearchBar/icons";
import styles from "./SearchBar.module.css";

const BLOG_RESULT_TYPE = "blog";
const BLOG_RESULT_LIMIT = 3;
let blogPostsPromise;

function fetchBlogPosts() {
    if (!blogPostsPromise) {
        blogPostsPromise = fetch("/api/posts")
            .then((response) => {
            if (!response.ok) {
                throw new Error(`Blog search request failed with status ${response.status}`);
            }
            return response.json();
        })
            .then((posts) => {
            if (!Array.isArray(posts)) {
                throw new Error("Blog search response was not a post list");
            }
            return posts.filter((post) => post &&
                typeof post.title === "string" &&
                typeof post.slug === "string");
        })
            .catch((error) => {
            console.error("Failed to load blog posts for search:", error);
            return [];
        });
    }
    return blogPostsPromise;
}

function searchBlogPosts(input, posts, baseUrl) {
    const tokens = input.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
        return [];
    }
    return posts
        .map((post) => {
        const title = post.title;
        const section = String(post.section || "Community blog");
        const content = String(post.content || "").replace(/<[^>]*>/g, " ");
        const normalizedTitle = title.toLowerCase();
        const normalizedSection = section.toLowerCase();
        const normalizedContent = content.toLowerCase();
        if (!tokens.every((token) => `${normalizedTitle} ${normalizedSection} ${normalizedContent}`.includes(token))) {
            return null;
        }
        const score = tokens.reduce((total, token) => total +
            (normalizedTitle.includes(token) ? 3 : normalizedSection.includes(token) ? 2 : 1), 0);
        return {
            document: {
                i: `blog-${post.id || post.slug}`,
                t: title,
                u: `${baseUrl}blog?slug=${encodeURIComponent(post.slug)}`,
            },
            type: BLOG_RESULT_TYPE,
            page: { t: `Blog · ${section}` },
            metadata: {},
            tokens,
            score,
        };
    })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, BLOG_RESULT_LIMIT);
}

function BlogSuggestionTemplate({ document, page, tokens }) {
    return [
        `<span class="${styles.hitIcon}">${iconContent}</span>`,
        `<span class="${styles.hitWrapper}">`,
        `<span class="${styles.hitTitle}">${highlight(document.t, tokens)}</span>`,
        `<span class="${styles.hitPath}">${escapeHtml(page.t)}</span>`,
        "</span>",
        `<span class="${styles.hitAction}">${iconAction}</span>`,
    ].join("");
}
async function fetchAutoCompleteJS() {
    const autoCompleteModule = await import("@easyops-cn/autocomplete.js");
    const autoComplete = autoCompleteModule.default;
    if (autoComplete.noConflict) {
        // For webpack v5 since docusaurus v2.0.0-alpha.75
        autoComplete.noConflict();
    }
    else if (autoCompleteModule.noConflict) {
        // For webpack v4 before docusaurus v2.0.0-alpha.74
        autoCompleteModule.noConflict();
    }
    return autoComplete;
}
async function fetchOpenAskAI() {
    try {
        // Dynamic import of open-ask-ai (optional peer dependency)
        // This creates a separate webpack chunk that is only loaded when:
        // 1. The askAi option is configured
        // 2. This function is called (when user interacts with search)
        // If open-ask-ai is not installed, the import will fail and be caught gracefully
        const openAskAIModule = await import("open-ask-ai");
        await import("open-ask-ai/styles.css");
        return {
            AskAIWidget: openAskAIModule.AskAIWidget,
        };
    }
    catch (error) {
        // open-ask-ai is optional, return null if not available
        return null;
    }
}
const SEARCH_PARAM_HIGHLIGHT = "_highlight";
export default function SearchBar({ handleSearchBarToggle, }) {
    const isBrowser = useIsBrowser();
    const { siteConfig: { baseUrl }, i18n: { currentLocale }, } = useDocusaurusContext();
    // It returns undefined for non-docs pages
    const activePlugin = useActivePlugin();
    let versionUrl = baseUrl;
    const activeVersion = useActiveVersion(activePlugin?.pluginId ?? docsPluginIdForPreferredVersion);
    if (activeVersion && !activeVersion.isLast) {
        versionUrl = activeVersion.path + "/";
    }
    const history = useHistory();
    const location = useLocation();
    const searchBarRef = useRef(null);
    const indexStateMap = useRef(new Map());
    // Should the input be focused after the index is loaded?
    const focusAfterIndexLoaded = useRef(false);
    const [loading, setLoading] = useState(false);
    const [inputChanged, setInputChanged] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const search = useRef(null);
    const askAIWidgetRef = useRef(null);
    const [AskAIWidgetComponent, setAskAIWidgetComponent] = useState(null);
    const prevSearchContext = useRef("");
    const [searchContext, setSearchContext] = useState("");
    const prevVersionUrl = useRef(baseUrl);
    useEffect(() => {
        if (!Array.isArray(searchContextByPaths)) {
            if (prevVersionUrl.current !== versionUrl) {
                // Reset index state map once version url is changed.
                indexStateMap.current.delete("");
                prevVersionUrl.current = versionUrl;
            }
            return;
        }
        let nextSearchContext = "";
        if (location.pathname.startsWith(versionUrl)) {
            const uri = location.pathname.substring(versionUrl.length);
            let matchedPath;
            for (const _path of searchContextByPaths) {
                const path = typeof _path === "string" ? _path : _path.path;
                if (uri === path || uri.startsWith(`${path}/`)) {
                    matchedPath = path;
                    break;
                }
            }
            if (matchedPath) {
                nextSearchContext = matchedPath;
            }
        }
        if (prevSearchContext.current !== nextSearchContext) {
            // Reset index state map once search context is changed.
            indexStateMap.current.delete(nextSearchContext);
            prevSearchContext.current = nextSearchContext;
        }
        setSearchContext(nextSearchContext);
    }, [location.pathname, versionUrl]);
    const hidden = !!hideSearchBarWithNoSearchContext &&
        Array.isArray(searchContextByPaths) &&
        searchContext === "";
    const loadIndex = useCallback(async () => {
        if (hidden || indexStateMap.current.get(searchContext)) {
            // Do not load the index (again) if its already loaded or in the process of being loaded.
            return;
        }
        indexStateMap.current.set(searchContext, "loading");
        search.current?.autocomplete.destroy();
        setLoading(true);
        const [autoComplete, openAskAIModule] = await Promise.all([
            fetchAutoCompleteJS(),
            askAi ? fetchOpenAskAI() : Promise.resolve(null),
            fetchIndexesByWorker(versionUrl, searchContext),
        ]);
        if (openAskAIModule) {
            setAskAIWidgetComponent(() => openAskAIModule.AskAIWidget);
        }
        const searchFooterLinkElement = ({ query, isEmpty, }) => {
            const a = document.createElement("a");
            const params = new URLSearchParams();
            params.set("q", query);
            let linkText;
            if (searchContext) {
                const detailedSearchContext = searchContext && Array.isArray(searchContextByPaths)
                    ? searchContextByPaths.find((item) => typeof item === "string"
                        ? item === searchContext
                        : item.path === searchContext)
                    : searchContext;
                const translatedSearchContext = detailedSearchContext
                    ? normalizeContextByPath(detailedSearchContext, currentLocale).label
                    : searchContext;
                if (useAllContextsWithNoSearchContext && isEmpty) {
                    linkText = translate({
                        id: "theme.SearchBar.seeAllOutsideContext",
                        message: 'See all results outside "{context}"',
                    }, { context: translatedSearchContext });
                }
                else {
                    linkText = translate({
                        id: "theme.SearchBar.searchInContext",
                        message: 'See all results within "{context}"',
                    }, { context: translatedSearchContext });
                }
            }
            else {
                linkText = translate({
                    id: "theme.SearchBar.seeAll",
                    message: "See all results",
                });
            }
            if (searchContext &&
                Array.isArray(searchContextByPaths) &&
                (!useAllContextsWithNoSearchContext || !isEmpty)) {
                params.set("ctx", searchContext);
            }
            if (versionUrl !== baseUrl) {
                if (!versionUrl.startsWith(baseUrl)) {
                    throw new Error(`Version url '${versionUrl}' does not start with base url '${baseUrl}', this is a bug of \`@easyops-cn/docusaurus-search-local\`, please report it.`);
                }
                params.set("version", versionUrl.substring(baseUrl.length));
            }
            const url = `${baseUrl}search/?${params.toString()}`;
            a.href = url;
            a.textContent = linkText;
            a.addEventListener("click", (e) => {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    search.current?.autocomplete.close();
                    history.push(url);
                }
            });
            return a;
        };
        search.current = autoComplete(searchBarRef.current, {
            hint: false,
            autoselect: true,
            openOnFocus: true,
            cssClasses: {
                root: clsx(styles.searchBar, {
                    [styles.searchBarLeft]: searchBarPosition === "left",
                }),
                noPrefix: true,
                dropdownMenu: styles.dropdownMenu,
                input: styles.input,
                hint: styles.hint,
                suggestions: styles.suggestions,
                suggestion: styles.suggestion,
                cursor: styles.cursor,
                dataset: styles.dataset,
                empty: styles.empty,
            },
        }, [
            {
                source: async (input, callback) => {
                    const [result, posts] = await Promise.all([
                        searchByWorker(versionUrl, searchContext, input, searchResultLimits),
                        input.trim() ? fetchBlogPosts() : Promise.resolve([]),
                    ]);
                    const blogResults = searchBlogPosts(input, posts, baseUrl);
                    const combinedResults = [
                        ...blogResults,
                        ...result.slice(0, Math.max(searchResultLimits - blogResults.length, 0)),
                    ];
                    if (input && askAi) {
                        callback([
                            {
                                document: {
                                    i: -1,
                                    t: "",
                                    u: "",
                                },
                                type: SearchDocumentType.AskAI,
                                page: undefined,
                                metadata: {},
                                tokens: [input],
                            },
                            ...combinedResults,
                        ]);
                    }
                    else {
                        callback(combinedResults);
                    }
                },
                templates: {
                    suggestion: (result) => result.type === BLOG_RESULT_TYPE
                        ? BlogSuggestionTemplate(result)
                        : SuggestionTemplate(result),
                    empty: EmptyTemplate,
                    footer: ({ query, isEmpty }) => {
                        if (isEmpty &&
                            (!searchContext || !useAllContextsWithNoSearchContext)) {
                            return;
                        }
                        const a = searchFooterLinkElement({ query, isEmpty });
                        const div = document.createElement("div");
                        div.className = styles.hitFooter;
                        div.appendChild(a);
                        return div;
                    },
                },
            },
        ])
            .on("autocomplete:selected", function (event, { document: { u, h }, type, tokens }) {
            searchBarRef.current?.blur();
            if (type === SearchDocumentType.AskAI && askAi) {
                askAIWidgetRef.current?.openWithNewSession(tokens.join(""));
                return;
            }
            let url = u;
            if (Mark && tokens.length > 0) {
                const params = new URLSearchParams();
                for (const token of tokens) {
                    params.append(SEARCH_PARAM_HIGHLIGHT, token);
                }
                url += `${url.includes("?") ? "&" : "?"}${params.toString()}`;
            }
            if (h) {
                url += h;
            }
            history.push(url);
        })
            .on("autocomplete:closed", () => {
            searchBarRef.current?.blur();
        });
        indexStateMap.current.set(searchContext, "done");
        setLoading(false);
        if (focusAfterIndexLoaded.current) {
            const input = searchBarRef.current;
            if (input.value) {
                search.current?.autocomplete.open();
            }
            input.focus();
            // On small screens the input is collapsed by default; after expanding via
            // focus, move the caret to the end so backspace works as expected.
            if (window.matchMedia("(max-width: 576px)").matches) {
                input.setSelectionRange(input.value.length, input.value.length);
            }
        }
    }, [hidden, searchContext, versionUrl, baseUrl, history]);
    useEffect(() => {
        if (!Mark) {
            return;
        }
        const keywords = isBrowser
            ? new URLSearchParams(location.search).getAll(SEARCH_PARAM_HIGHLIGHT)
            : [];
        // A workaround to fix an issue of highlighting in code blocks.
        // See https://github.com/easyops-cn/docusaurus-search-local/issues/92
        // Code blocks will be re-rendered after this `useEffect` ran.
        // So we make the marking run after a macro task.
        setTimeout(() => {
            const root = document.querySelector("article");
            if (!root) {
                return;
            }
            const mark = new Mark(root);
            mark.unmark();
            if (keywords.length !== 0) {
                mark.mark(keywords, {
                    exclude: [".theme-doc-toc-mobile > button"],
                });
            }
            // Apply any keywords to the search input so that we can clear marks in case we loaded a page with a highlight in the url
            setInputValue(keywords.join(" "));
            search.current?.autocomplete.setVal(keywords.join(" "));
        });
    }, [isBrowser, location.search, location.pathname]);
    const [focused, setFocused] = useState(false);
    const onInputFocus = useCallback(() => {
        focusAfterIndexLoaded.current = true;
        loadIndex();
        setFocused(true);
        handleSearchBarToggle?.(true);
        // On small screens the input is collapsed by default; after expanding via
        // focus, move the caret to the end so backspace works as expected.
        // On large screens we leave the native caret behaviour untouched.
        if (window.matchMedia("(max-width: 576px)").matches) {
            const input = searchBarRef.current;
            if (input) {
                setTimeout(() => {
                    input.setSelectionRange(input.value.length, input.value.length);
                }, 0);
            }
        }
    }, [handleSearchBarToggle, loadIndex]);
    const onInputBlur = useCallback(() => {
        setFocused(false);
        handleSearchBarToggle?.(false);
    }, [handleSearchBarToggle]);
    const onInputMouseEnter = useCallback(() => {
        loadIndex();
    }, [loadIndex]);
    const onInputChange = useCallback((event) => {
        setInputValue(event.target.value);
        if (event.target.value) {
            setInputChanged(true);
        }
    }, []);
    // Implement hint icons for the search shortcuts on mac and the rest operating systems.
    const isMac = isBrowser ? isMacPlatform() : false;
    // Sync the input value and focus state for SSR
    useEffect(() => {
        const searchBar = searchBarRef.current;
        const domValue = searchBar?.value;
        if (domValue) {
            setInputValue(domValue);
        }
        if (searchBar && document.activeElement === searchBar) {
            focusAfterIndexLoaded.current = true;
            loadIndex();
            setFocused(true);
            handleSearchBarToggle?.(true);
        }
    }, 
    // Only run this effect on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    useEffect(() => {
        if (!searchBarShortcut || !searchBarShortcutKeymap) {
            return;
        }
        const parsedKeymap = parseKeymap(searchBarShortcutKeymap);
        // Add shortcuts based on custom keymap
        const handleShortcut = (event) => {
            if (matchesKeymap(event, parsedKeymap)) {
                event.preventDefault();
                searchBarRef.current?.focus();
                onInputFocus();
            }
        };
        document.addEventListener("keydown", handleShortcut);
        return () => {
            document.removeEventListener("keydown", handleShortcut);
        };
    }, [onInputFocus, searchBarShortcutKeymap]);
    const onClearSearch = useCallback(() => {
        const params = new URLSearchParams(location.search);
        params.delete(SEARCH_PARAM_HIGHLIGHT);
        const paramsStr = params.toString();
        const searchUrl = location.pathname +
            (paramsStr != "" ? `?${paramsStr}` : "") +
            location.hash;
        if (searchUrl != location.pathname + location.search + location.hash) {
            history.push(searchUrl);
        }
        // We always clear these here because in case no match was selected the above history push wont happen
        setInputValue("");
        search.current?.autocomplete.setVal("");
    }, [location.pathname, location.search, location.hash, history]);
    return (<div className={clsx("navbar__search", styles.searchBarContainer, {
            [styles.searchIndexLoading]: loading && inputChanged,
            [styles.focused]: focused,
        })} hidden={hidden} 
    // Manually make the search bar be LTR even if in RTL
    dir="ltr">
      <svg aria-hidden="true" className={styles.searchIcon} focusable="false" viewBox="0 0 16 16">
        <path fill="currentColor" d="M6.02945 10.20327a4.17382 4.17382 0 1 1 4.17382-4.17382 4.15609 4.15609 0 0 1-4.17382 4.17382Zm9.69195 4.2199-4.8225-4.82338A5.88021 5.88021 0 0 0 12.058 6.02856 6.00467 6.00467 0 1 0 9.59979 10.8989l4.82338 4.82338a.89729.89729 0 0 0 1.29912 0 .89749.89749 0 0 0-.00087-1.29909Z"/>
      </svg>
      <input placeholder={translate({
            id: "theme.SearchBar.label",
            message: "Search",
            description: "The ARIA label and placeholder for search button",
        })} aria-label="Search" className={`navbar__search-input ${styles.searchInput}`} onMouseEnter={onInputMouseEnter} onFocus={onInputFocus} onBlur={onInputBlur} onChange={onInputChange} ref={searchBarRef} value={inputValue}/>
      {askAi && AskAIWidgetComponent && (<AskAIWidgetComponent ref={askAIWidgetRef} {...askAi}>
          <span hidden></span>
        </AskAIWidgetComponent>)}
      <LoadingRing className={styles.searchBarLoadingRing}/>
      {searchBarShortcut &&
            searchBarShortcutHint &&
            (inputValue !== "" ? (<button className={styles.searchClearButton} onClick={onClearSearch}>
            ✕
          </button>) : (isBrowser &&
                searchBarShortcutKeymap && (<div className={styles.searchHintContainer}>
              {getKeymapHints(searchBarShortcutKeymap, isMac).map((hint, index) => (<kbd key={index} className={styles.searchHint}>
                    {hint}
                  </kbd>))}
            </div>)))}
    </div>);
}

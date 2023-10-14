import React, { useCallback, useEffect, useState } from "react";
import LayoutBorderRadius from "../layouts/LayoutBorderRadius";

import { news } from "../data/news";
import PostNews from "../components/PostNews/PostNews";
import { useDebounce } from "../hooks/useDebounce";
import { usePosts } from "../hooks/usePosts";
import SelectSort from "../components/PostNews/ui/SelectSort";
import { DATA_SORT_LIST as dataList } from "../components/PostNews/const";
import { useDispatch, useSelector } from "react-redux";
import { setNews } from "../redux/news/news";
import ButtonShowAllOrFavoritesNews from "../components/PostNews/ui/ButtonShowAllOrFavoritesNews";
import FloatingButton from "../components/PostNews/ui/FloatingButton";
import Skeleton from "../components/PostNews/ui/Skeleton";

const News = () => {
  const [sortValue, setSortValue] = useState(dataList[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayed, setDisplayed] = useState(10);
  const [term, setTerm] = useState("");
  const [isShowFavorites, setIsShowFavorites] = useState(false);

  const { news: stateNews, favorites } = useSelector(state => state.news);
  const favoritesOrAllNews = isShowFavorites ? favorites : stateNews;

  const dispatch = useDispatch();

  const debounceSearch = useDebounce(term, 600);
  const posts = usePosts(favoritesOrAllNews, sortValue.name, debounceSearch);

  const showMore = () => {
    setDisplayed(prev => prev + 10);
  };

  const handleSearch = e => {
    setDisplayed(10);
    setTerm(e.target.value);
  };

  const createPreview = text => {
    const paragraphZero = text.match(/<p>.*?<\/p>/g);
    let preview = paragraphZero[0].split(" ").slice(0, 20).join(" ");

    if (!/<a\s[^>]*?>.*?<\/a>/.test(preview)) {
      preview = paragraphZero[0].split(" ").slice(0, 20).join(" ");
    }

    if (!/<mark\s[^>]*?>.*?<\/mark>/.test(preview)) {
      preview = paragraphZero[0].split(" ").slice(0, 20).join(" ");
    }

    if (!/<p>[\s\S]*<\/p>$/.test(preview)) {
      preview += "</p>";
    }

    return preview;
  };

  const paintingText = useCallback(
    text => {
      const searchRegex = new RegExp(debounceSearch, "gi");

      const highlighted = text.replace(searchRegex, match => {
        return `<mark className='bg-violet-300'>${match}</mark>`;
      });

      return highlighted;
    },
    [debounceSearch, sortValue]
  );

  const getContent = data => {
    return data.slice(0, displayed).map(item => {
      const title =
        sortValue.name === "title" && debounceSearch && posts.length > 0
          ? paintingText(item.title)
          : item.title;

      const content =
        sortValue.name === "content" && debounceSearch && posts.length > 0
          ? paintingText(item.content)
          : item.content;

      const preview = createPreview(content);

      return (
        <PostNews
          key={item.id}
          id={item.id}
          title={title}
          content={content}
          image={item.image}
          preview={preview}
        />
      );
    });
  };

  const renderButton = () => {
    const total = posts.length > 0 && posts.length;
    const count = total - displayed < 10 ? Math.floor(total % displayed) : 10;
    if (term && posts.length === 0) {
      return null;
    }

    if (displayed < total) {
      return (
        <button
          className="block mx-auto mt-16 border-2 p-2 rounded-lg"
          onClick={showMore}
        >
          Добавить ещё {count} новостей
        </button>
      );
    }
  };

  const msgNotSearchData =
    posts.length === 0 && debounceSearch ? (
      <div className="flex justify-center mt-14">Not Search Data</div>
    ) : null;

  useEffect(() => {
    const getData = () => {
      setTimeout(() => {
        setIsLoading(false);
        const newsData = news.content.map((obj, index) => {
          return { id: index + 1, ...obj };
        });
        dispatch(setNews(newsData));
      }, 3000);
    };
    getData();
  }, []);

  return (
    <>
      <LayoutBorderRadius>
        <div className="flex justify-space-between items-center gap-4">
          <div className="relative flex-grow basis-0 rounded-md shadow-md">
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-0 py-2.5 pl-3 pr-20 text-[#6f6f6f] font-medium ring-1 ring-inset ring-gray-300 tracking-widest border-[#fff] placeholder:text-[#6f6f6f] focus:outline-0 focus:border-[#b5b1ff] focus:border-2 sm:text-sm sm:leading-6"
              placeholder="Search..."
              value={term}
              onChange={handleSearch}
            />
            <div className="absolute inset-y-0 right-5 flex items-center">
              <SelectSort dataList={dataList} onChange={setSortValue} />
            </div>
          </div>
          <div className="basis-14 h-10 self-center">
            <ButtonShowAllOrFavoritesNews
              isActive={isShowFavorites}
              onClick={setIsShowFavorites}
            />
          </div>
        </div>
        <>
          {!isLoading ? (
            <>
              <div>
                {getContent(posts)}
                {msgNotSearchData}
                {isShowFavorites && favorites.length === 0 && (
                  <div className="flex justify-center mt-14">
                    Not Favorites News
                  </div>
                )}
              </div>
              {renderButton()}
            </>
          ) : (
            Array.from({ length: 3 }).fill(<Skeleton />)
          )}
        </>
      </LayoutBorderRadius>
      <FloatingButton />
    </>
  );
};

export default News;

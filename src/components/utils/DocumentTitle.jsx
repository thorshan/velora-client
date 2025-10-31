import { useEffect } from "react";
const DEFAULT_TITLE = "Velora | Yours Favourite Partner";

export function DocumentTitle (title) {
  useEffect(() => {
    const newTitle = title ? `Velora | ${title} ` : DEFAULT_TITLE;
    document.title = newTitle;

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
};


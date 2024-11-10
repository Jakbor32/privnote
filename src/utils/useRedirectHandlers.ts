import { useEffect } from "react";

const REDIRECT_URL = "https://privnote-app.vercel.app/";
const SESSION_KEY_REFRESH = "redirectAfterRefresh";
const SESSION_KEY_NOT_FOUND = "redirectAfterRefreshNotFound";

const setSessionRedirect = (key: string) => sessionStorage.setItem(key, "true");
const removeSessionRedirect = (key: string) => sessionStorage.removeItem(key);
const shouldRedirectAfterRefresh = (key: string) => sessionStorage.getItem(key) === "true";

interface RedirectHandlersProps {
  revealed: boolean;
  noteContent: string;
  noteNotFound: boolean;
}

export const useRedirectHandlers = ({
  revealed,
  noteContent,
  noteNotFound,
}: RedirectHandlersProps) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (revealed && noteContent) {
        setSessionRedirect(SESSION_KEY_REFRESH);
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [revealed, noteContent]);

  useEffect(() => {
    if (shouldRedirectAfterRefresh(SESSION_KEY_REFRESH)) {
      removeSessionRedirect(SESSION_KEY_REFRESH);
      window.location.href = REDIRECT_URL;
    }
  }, []);

  useEffect(() => {
    if (noteNotFound) {
      setSessionRedirect(SESSION_KEY_NOT_FOUND);
    }
  }, [noteNotFound]);

  useEffect(() => {
    if (shouldRedirectAfterRefresh(SESSION_KEY_NOT_FOUND)) {
      removeSessionRedirect(SESSION_KEY_NOT_FOUND);
      window.location.href = REDIRECT_URL;
    }
  }, []);
};

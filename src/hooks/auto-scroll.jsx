import { useEffect, useRef } from "react";

function useScollRef(...dependencies) {
  const scrollRef = useRef();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [dependencies]);
  return scrollRef;
}

export default useScollRef;

import {
  useEffect, useMemo, useRef
} from 'react';

import AwesomeDebouncePromise from "awesome-debounce-promise";

const debounceAction = (actionFunc, delay) =>
  AwesomeDebouncePromise(actionFunc, delay);

export default function useDebounce(func, delay) {
  const latestFunRef = useRef();
  useEffect(() => {
    latestFunRef.current = func;
  })

  return useMemo(() => {
      return debounceAction((...args) => latestFunRef.current(...args), delay)
  }, [])
}

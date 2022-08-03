import React , { useState, useRef, useCallback } from 'react';
import useSearch from '../hooks/useSearch';

export default function InfiniteScrollList() {
  const [query, setQuery] = useState(''),
  [page, setPage] = useState(1);

  const {results, hasMore, loading, error} = useSearch(query, page);

  const observer = useRef(null),
  lastBookRef = useCallback(node => {
    console.log(node);
    if(loading){return;}
    if(observer.current){observer.current.disconnect();}
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        console.log('intersecting..');
        setPage(prev => prev + 1);
      }
    })
    if(node){observer.current.observe(node);}
  }, [loading, hasMore]);
  

  const handleSearch = (e) => {
    setQuery(e.target.value);
  }

  return (
    <div className="container infinite-list">
      <input type="text" onKeyUp={handleSearch} />
      {
        !error && <ul>
          {
            results.map((r, index) => {
              if(results.length === index + 1){
                return <li ref={lastBookRef} key={r}><h6>{r}</h6></li>
              }
            return <li key={r}><h6>{r}</h6></li>
          })
          }
        </ul>
      }
      {
        loading && <h5>Loading...</h5>
      }
      {
        error && <h5>Error!</h5>
      }
      
    </div>
  );
}

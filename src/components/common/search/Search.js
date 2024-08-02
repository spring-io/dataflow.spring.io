import React, { useState, useRef } from 'react'
import {
  Configure,
  InstantSearch,
  Snippet,
  Highlight,
  Hits,
  useSearchBox,
} from 'react-instantsearch'
import algoliasearch from 'algoliasearch/lite'
import { Link } from 'gatsby'

const searchClient = algoliasearch(
  'J2U2LZKKVF',
  '88ed3bbf31e90b48c231b5faa9ff23e4'
)

function Label({ hit }) {
  return (
    <>
      {Object.keys(hit.hierarchy)
        .filter((item, index) => {
          return index > 0 && hit.hierarchy[item]
        })
        .map((key, index) => {
          return (
            <>
              {index > 0 && <span className='separator'>{` - `}</span>}
              <Highlight
                attribute={`hierarchy.${key}`}
                hit={hit}
                tagName='mark'
                key={`hit${index}`}
                className='search-result-page blue'
              />
            </>
          )
        })}
    </>
  )
}

function Hit({ hit }) {
  return (
    <Link to={hit.url} className='link'>
      <div className={`title`}>
        <Label hit={hit} />
      </div>
      {hit?.content && (
        <div className={`html`}>
          <Snippet
            attribute='content'
            hit={hit}
            className='search-result-snippet'
          />
        </div>
      )}
    </Link>
  )
}

function SearchBox(props) {
  const { query, refine } = useSearchBox(props)
  const [inputValue, setInputValue] = useState(query)
  const inputRef = useRef(null)
  const { onBlurHandler, onQueryHandler } = props
  function setQuery(newQuery) {
    setInputValue(newQuery)
    refine(newQuery)
  }
  return (
    <div>
      <form
        action=''
        role='search'
        noValidate
        className='search-form'
        onSubmit={event => {
          event.preventDefault()
          event.stopPropagation()

          if (inputRef.current) {
            inputRef.current.blur()
          }
        }}
      >
        <input
          ref={inputRef}
          autoComplete='off'
          autoCorrect='off'
          autoCapitalize='off'
          placeholder='Search...'
          spellCheck={false}
          onBlur={() => {
            // onBlurHandler()
          }}
          maxLength={512}
          type='search'
          value={inputValue}
          className='input-control'
          onChange={event => {
            setQuery(event.currentTarget.value)
            onQueryHandler(event.currentTarget.value)
          }}
          autoFocus
        />
        <div className='algolia'>
          <img src='../images/algolia.svg' alt='Powered by Algolia' />
        </div>
      </form>
    </div>
  )
}

export default function Search({ algoliaVersion, onBlurHandler }) {
  const [show, setShow] = useState(false)
  return (
    <InstantSearch searchClient={searchClient} indexName='dataflow-spring'>
      <SearchBox
        onBlurHandler={onBlurHandler}
        onQueryHandler={query => {
          setShow(!!query.trim())
        }}
      />
      {show && <Hits hitComponent={Hit} />}
      <Configure
        attributesToSnippet='content'
        hitsPerPage={10}
        facetFilters={[`version:${algoliaVersion}`]}
      />
    </InstantSearch>
  )
}

import React from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"
import { navigate } from "gatsby"
import { get } from "lodash"

import {
  Highlight,
  Snippet,
  Index,
  Configure,
  connectAutoComplete,
} from "react-instantsearch-dom"
import Autosuggest from "react-autosuggest"

const HitTemplate = ({ hit }) => (
  <Link to={hit.url} className="link">
    <div className={`title`}>
      {/* <Highlight
        attribute="title"
        hit={hit}
        tagName="mark"
        className="search-result-page blue"
      /> */}
      <Highlight
        attribute="fullTitle"
        hit={hit}
        tagName="mark"
        className="search-result-page blue"
      />
    </div>
    <div className={`html`}>
      <Snippet attribute="html" hit={hit} className="search-result-snippet" />
      ...
    </div>
  </Link>
)

HitTemplate.propTypes = {
  hit: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
}

class Results extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: this.props.currentRefinement,
    }

    this.onChange = this.onChange.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(
      this
    )
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(
      this
    )
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.renderSectionTitle = this.renderSectionTitle.bind(this)
    this.getSectionSuggestions = this.getSectionSuggestions.bind(this)
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this)
  }

  onChange(event, { newValue }) {
    this.setState(() => {
      return { value: newValue }
    })
  }

  onSuggestionsFetchRequested({ value }) {
    this.props.refine(value)
  }

  onSuggestionsClearRequested() {
    this.props.refine()
  }

  getSuggestionValue(hit) {
    return hit.title
  }

  renderSuggestion(hit) {
    return <HitTemplate hit={hit} />
  }

  renderSectionTitle({ index }) {
    return <span className={`section-label}`}>{index}</span>
  }

  getSectionSuggestions(section) {
    return section.hits
  }

  onSuggestionSelected(e, { suggestion }) {
    navigate(suggestion.url)
  }

  render() {
    const hits = this.props.hits

    const { value } = this.state
    const inputProps = {
      placeholder: `Search...`,
      onChange: this.onChange,
      value,
      autoFocus: true,
      "data-cy": `search-input`,
    }

    const inputTheme = `control-input`

    const theme = {
      input: inputTheme,
      inputOpen: inputTheme,
      inputFocused: inputTheme,
      suggestionsContainerOpen: `result`,
      suggestionsList: `list`,
      sectionContainer: `section`,
      sectionTitle: `section-title`,
    }

    return (
      <>
        <Configure hitsPerPage="5" />
        <Autosuggest
          suggestions={hits}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          multiSection={false}
          theme={theme}
          renderSectionTitle={this.renderSectionTitle}
          getSectionSuggestions={this.getSectionSuggestions}
        />
        <Index indexName="Doc" />
      </>
    )
  }
}

Results.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  currentRefinement: PropTypes.string.isRequired,
  refine: PropTypes.func.isRequired,
}

const AutoComplete = connectAutoComplete(Results)

export default AutoComplete

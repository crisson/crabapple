import reactTapEventPlugin from 'react-tap-event-plugin'

import React from 'react'

reactTapEventPlugin()

import Homepage from '@scrabble/Homepage.jsx'

React.render(<Homepage />, document.querySelector('#app'))
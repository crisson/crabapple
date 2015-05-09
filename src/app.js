import reactTapEventPlugin from 'react-tap-event-plugin'

import React from 'react'
import Reflux from 'reflux'
import Bluebird from 'bluebird'

reactTapEventPlugin()

Reflux.setPromise(Bluebird)

import Homepage from '@crabapple/Homepage.jsx'

React.render( < Homepage / > , document.querySelector('#app'))

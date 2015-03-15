import React from 'react';

import {Mixins} from 'material-ui'

export default React.createClass({

    displayName: 'Deck',

    mixins: [Mixins.Classable],

    getDefaultProps() {
        return {};
    },

    propTypes: {},

    render() {
        let {name} = this.props
        let classNames = this.getClasses('deck', {})

        return (
            <span className={classNames}>
                {name}
            </span>
        );
    }

});
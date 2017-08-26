import Component from '@ember/component';
import calculatePosition from 'ember-basic-dropdown/utils/calculate-position';
import {computed} from '@ember/object';
import {htmlSafe} from '@ember/string';
import {inject as injectService} from '@ember/service';

export default Component.extend({
    config: injectService(),
    feature: injectService(),
    ghostPaths: injectService(),
    routing: injectService('-routing'),
    session: injectService(),
    ui: injectService(),

    tagName: 'nav',
    classNames: ['gh-nav'],
    classNameBindings: ['open'],

    open: false,
    iconStyle: '',

    // the menu has a rendering issue (#8307) when the the world is reloaded
    // during an import which we have worked around by not binding the icon
    // style directly. However we still need to keep track of changing icons
    // so that we can refresh when a new icon is uploaded
    didReceiveAttrs() {
        this._setIconStyle();
    },

    mouseEnter() {
        this.sendAction('onMouseEnter');
    },

    showMenuExtension: computed('config.clientExtensions.menu', 'session.user.isOwner', function() {
        return this.get('config.clientExtensions.menu') && this.get('session.user.isOwner');
    }),

    showDropdownExtension: computed('config.clientExtensions.dropdown', 'session.user.isOwner', function() {
        return this.get('config.clientExtensions.dropdown') && this.get('session.user.isOwner');
    }),

    showScriptExtension: computed('config.clientExtensions.script', 'session.user.isOwner', function() {
        return this.get('config.clientExtensions.script') && this.get('session.user.isOwner');
    }),

    // equivalent to "left: auto; right: -20px"
    userDropdownPosition(trigger, dropdown) {
        let {horizontalPosition, verticalPosition, style} = calculatePosition(...arguments);
        let {width: dropdownWidth} = dropdown.firstElementChild.getBoundingClientRect();

        style.right += (dropdownWidth - 20);
        style['z-index'] = 1100;

        return {horizontalPosition, verticalPosition, style};
    },

    _setIconStyle() {
        let icon = this.get('icon');

        if (icon === this._icon) {
            return;
        }

        let subdirRegExp = new RegExp(`^${this.get('ghostPaths.subdir')}`);
        let blogIcon = icon ? icon : 'favicon.ico';
        let iconUrl;

        blogIcon = blogIcon.replace(subdirRegExp, '');

        iconUrl = blogIcon;
        iconUrl += `?t=${(new Date()).valueOf()}`;

        this.set('iconStyle', htmlSafe(`background-image: url(${iconUrl})`));
        this._icon = icon;
    },

    actions: {
        showMarkdownHelp() {
            this.sendAction('showMarkdownHelp');
        }
    }
});

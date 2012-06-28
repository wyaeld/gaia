/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
'use strict';

var PopupManager = {
  _currentPopup: null,

  container: document.getElementById('popup-container'),

  screen: document.getElementById('screen'),

  init: function pm_init() {
    window.addEventListener('mozbrowseropenwindow', this.open.bind(this));
    window.addEventListener('mozbrowserclose', this.close.bind(this));

    window.addEventListener('keyup', this.backHandling.bind(this), true);
  },

  open: function pm_open(evt) {
    // only one popup at a time
    if (this._currentPopup)
      return;

    this._currentPopup = evt.detail.frameElement;
    var popup = this._currentPopup;
    popup.dataset.frameType = 'popup';

    // FIXME: won't be needed once
    // https://bugzilla.mozilla.org/show_bug.cgi?id=769182 is fixed
    popup.src = evt.detail.url;

    this.container.appendChild(popup);
    this.screen.classList.add('popup');
  },

  close: function pm_close(evt) {
    var target = evt ? evt.target : this._currentPopup;

    this.screen.classList.remove('popup');

    var self = this;
    this.container.addEventListener('transitionend', function trWait() {
      self.container.removeEventListener('transitionend', trWait);
      self.container.removeChild(target);

      self._currentPopup = null;
    });

    // We just removed the focused window leaving the system
    // without any focused window, let's fix this.
    window.focus();
  },

  backHandling: function pm_backHandling(evt) {
    if (!this._currentPopup)
      return;

    if (evt.keyCode == evt.DOM_VK_ESCAPE ||
        evt.keyCode == evt.DOM_VK_HOME) {

      this.close();
      evt.preventDefault();
      evt.stopPropagation();
    }
  }
};

PopupManager.init();

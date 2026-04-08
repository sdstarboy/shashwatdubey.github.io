/**
 * Mobile / tablet nav for Elementor burger menu: toggles .elementor-active on the
 * menu button so the dropdown (.elementor-nav-menu--dropdown) shows per theme CSS.
 * Replaces the toggle node to drop any broken third-party listeners (static exports).
 */
(function () {
	'use strict';

	function getDropdown(toggle) {
		var widget = toggle.closest('.elementor-widget-nav-menu');
		if (!widget) return null;
		return widget.querySelector('nav.elementor-nav-menu--dropdown');
	}

	function setOpen(toggle, open) {
		var dropdown = getDropdown(toggle);
		if (open) {
			toggle.classList.add('elementor-active');
			toggle.setAttribute('aria-expanded', 'true');
			if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
		} else {
			toggle.classList.remove('elementor-active');
			toggle.setAttribute('aria-expanded', 'false');
			if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
		}
	}

	function bindToggle(toggle) {
		var clone = toggle.cloneNode(true);
		toggle.parentNode.replaceChild(clone, toggle);

		clone.addEventListener('click', function (e) {
			e.preventDefault();
			var isOpen = clone.classList.contains('elementor-active');
			setOpen(clone, !isOpen);
		});

		clone.addEventListener('keydown', function (e) {
			if (e.key !== 'Enter' && e.key !== ' ') return;
			e.preventDefault();
			var isOpen = clone.classList.contains('elementor-active');
			setOpen(clone, !isOpen);
		});
	}

	function closeAll() {
		document.querySelectorAll('.elementor-menu-toggle.elementor-active').forEach(function (t) {
			setOpen(t, false);
		});
	}

	function init() {
		document.querySelectorAll('.elementor-menu-toggle').forEach(bindToggle);

		document.addEventListener('click', function (e) {
			if (!e.target.closest) return;
			var toggle = e.target.closest('.elementor-menu-toggle');
			if (toggle) return;
			var insideDropdown = e.target.closest('.elementor-nav-menu--dropdown');
			if (!insideDropdown) closeAll();
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape') closeAll();
		});

		document.querySelectorAll('.elementor-nav-menu--dropdown a').forEach(function (link) {
			link.addEventListener('click', function () {
				var dd = link.closest('.elementor-nav-menu--dropdown');
				if (!dd) return;
				var widget = dd.closest('.elementor-widget-nav-menu');
				if (!widget) return;
				var t = widget.querySelector('.elementor-menu-toggle');
				if (t) setOpen(t, false);
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

// ==UserScript==
// @id             iitc-plugin-get-portals@yech
// @name           IITC plugin: get portals
// @version        0.0.1.20130917.190000
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Get portal infomation
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==


function wrapper() {
    // ensure plugin framework is there, even if iitc is not yet loaded
    if (typeof window.plugin !== 'function') {
        window.plugin = function () {
        };
    }


    // PLUGIN START ////////////////////////////////////////////////////////

    // use own namespace for plugin
    window.plugin.portalInfo = function () {
    };


    window.plugin.portalInfo.setupCallback = function (data) {
        $('#toolbox').append(' <a onclick="window.plugin.portalInfo.getPortals();return false;" title="list portal info">All Portals</a>');
    };

    

    //fill the listPortals array with portals avalaible on the map (level filtered portals will not appear in the table)
    window.plugin.portalInfo.getPortals = function () {
        //filter : 0 = All, 1 = Res, 2 = Enl
        //console.log('** getPortals');
        var retval = false;

        var displayBounds = map.getBounds();

       
        //get portals informations from IITC
        $.each(window.portals, function (i, portal) {
            // eliminate offscreen portals (selected, and in padding)
            var pos = portal.getLatLng();
            if (!displayBounds.contains(pos)) return true;

            retval = true;
            var d = portal.options.details;
            var name = d.portalV2.descriptiveText.TITLE;
            var address = d.portalV2.descriptiveText.ADDRESS;
           
            var team = portal.options.team;
            var level = getPortalLevel(d).toFixed(2);
            var guid = portal.options.guid;
           

            var thisPortal = {'portal':d, 'name':name, 'team':team, 'level':level, 'guid':guid, 'pos':pos};
            console.log(thisPortal);
        });

        return retval;
    };


    var setup = function () {
        window.plugin.portalInfo.setupCallback();
    };

    // PLUGIN END //////////////////////////////////////////////////////////

    if (window.iitcLoaded && typeof setup === 'function') {
        setup();
    } else {
        if (window.bootPlugins) {
            window.bootPlugins.push(setup);
        } else {
            window.bootPlugins = [setup];
        }
    }
} // wrapper end
// inject code into site context
var script = document.createElement('script');
script.appendChild(document.createTextNode('(' + wrapper + ')();'));
(document.body || document.head || document.documentElement).appendChild(script);

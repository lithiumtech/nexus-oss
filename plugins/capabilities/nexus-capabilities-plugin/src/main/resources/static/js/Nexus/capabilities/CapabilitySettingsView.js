/*
 * Sonatype Nexus (TM) Open Source Version
 * Copyright (c) 2007-2013 Sonatype, Inc.
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/oss/attributions.
 *
 * This program and the accompanying materials are made available under the terms of the Eclipse Public License Version 1.0,
 * which accompanies this distribution and is available at http://www.eclipse.org/legal/epl-v10.html.
 *
 * Sonatype Nexus (TM) Professional Version is available from Sonatype, Inc. "Sonatype" and "Sonatype Nexus" are trademarks
 * of Sonatype, Inc. Apache Maven is a trademark of the Apache Software Foundation. M2eclipse is a trademark of the
 * Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/

/**
 * Capability Settings View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitySettingsView', {
    extend: 'Ext.FormPanel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    ///**
    // * @override
    // */
    //initComponent: function () {
    //
    //},

    /**
     * @property
     */
    capabilityType: undefined,

    /**
     * @constructor
     */
    constructor: function (capabilityType) {
        NX.assert(capabilityType, 'Missing capabilityType');
        this.capabilityType = capabilityType;

var self = this;

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilitySettingsView',
            layout : 'card',
            region : 'center',
            activeItem : 0,
            bodyStyle : 'padding:0px 15px 0px 15px',
            deferredRender : false,
            autoScroll : false,
            autoHeight : true,
            border: false,
            //frame : false,
            //visible : false,
            hidden: true,
            items : {
                xtype : 'fieldset',
                autoHeight : true,
                checkboxToggle : false,
                title : 'Settings',
                anchor : Sonatype.view.FIELDSET_OFFSET,
                collapsible : false,
                layoutConfig : {
                    labelSeparator : ''
                },
                items : {
                    xtype : 'panel',
                    name : 'status',
                    layout : 'fit',
                    border: false
                }
            }
        });

        self.constructor.superclass.initComponent.apply(self, arguments);
    },

    /**
     * Update the capability record.
     *
     * @param capability
     */
    updateRecord: function (capability) {
        var self = this;
    }

});
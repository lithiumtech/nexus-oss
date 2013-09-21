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
 * Capability Type View.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityTypeView', {
    extend: 'Ext.FormPanel',

    mixins: [
        'Nexus.LogAwareMixin'
    ],

    /**
     * @override
     */
    initComponent: function () {
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator;

        Ext.apply(self, {
            cls: 'nx-capabilities-CapabilityTypeView',
            region: 'center',
            autoScroll: true,
            border: false,
            collapsible: false,
            collapsed: false,
            labelWidth: 75,
            layoutConfig: {
                labelSeparator: ''
            },
            items: {
                layout: 'column',
                border: false,
                items: [{
                    xtype: 'fieldset',
                    autoHeight: true,
                    collapsed: false,
                    border: false,
                    columnWidth : .4,
                    width: '400px',
                    items: [{
                        xtype: 'checkbox',
                        fieldLabel: 'Enabled',
                        labelStyle: 'margin-left: 15px; width: 60px',
                        helpText: 'This flag determines if the capability is currently enabled. To disable this capability for a period of time, de-select this checkbox.',
                        name: 'enabled',
                        allowBlank: false,
                        checked: true
                    }, {
                        xtype: 'checkbox',
                        fieldLabel: 'Active',
                        labelStyle: 'margin-left: 15px; width: 60px',
                        helpText: 'Shows if the capability is current active or not. If not active, a text will be displayed explaining why.',
                        name: 'active',
                        allowBlank: false,
                        checked: false,
                        disabled: true
                    }, {
                        xtype: 'combo',
                        fieldLabel: 'Type',
                        labelStyle: 'margin-left: 15px; width: 60px',
                        itemCls: 'required-field',
                        helpText: "Type of configured capability",
                        name: 'typeId',
                        store: mediator.capabilityTypeStore,
                        displayField: 'name',
                        valueField: 'id',
                        editable: false,
                        forceSelection: true,
                        mode: 'local',
                        triggerAction: 'all',
                        emptyText: 'Select...',
                        selectOnFocus: true,
                        allowBlank: false,
                        width: 300,
                        listeners: {
                            select: {
                                fn: function(combo, record) {
                                   var about = self.find('name','about')[0];
                                   about.body.update(record.data.about);
                                }
                            }
                        }
                    }, {
                        xtype: 'textfield',
                        htmlDecode: true,
                        fieldLabel: 'Notes',
                        labelStyle: 'margin-left: 15px; width: 60px; margin-bottom:10px',
                        itemCls: '',
                        helpText: "Optional notes about configured capability",
                        name: 'notes',
                        width: 300,
                        allowBlank: true
                    }]
                },{
                    xtype : 'panel',
                    columnWidth : .6,
                    name : 'about-panel',
                    header : false,
                    layout : 'card',
                    region : 'center',
                    activeItem : 0,
                    bodyStyle : 'padding:0px 15px 0px 15px',
                    deferredRender : false,
                    frame : false,
                    border: false,
                    autoHeight : true,
                    items : [{
                        xtype : 'fieldset',
                        title : 'About',
                        checkboxToggle : false,
                        collapsible : false,
                        autoHeight : true,
                        layoutConfig : {
                            labelSeparator : ''
                        },
                        items : [{
                            xtype : 'panel',
                            cls: 'x-grid-empty',
                            name : 'about',
                            html : '',
                            layout : 'fit',
                            autoScroll : true,
                            height : 80      ,
                            border: false
                        }]
                    }]
                }]
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
        var self = this,
            mediator = Nexus.capabilities.CapabilitiesMediator,
            active = self.find('name','active')[0],
            typeIdCombo = self.find('name','typeId')[0];

        if (capability) {
            typeIdCombo.disable();
            self.getForm().setValues(capability);
            if (capability.typeId) {
                var capabilityTypeRecord = mediator.capabilityTypeStore.getById(capability.typeId);
                if (capabilityTypeRecord) {
                  typeIdCombo.fireEvent('select', typeIdCombo, capabilityTypeRecord);
                }
            }
        }
        else {
            typeIdCombo.disable();
        }
    }

});
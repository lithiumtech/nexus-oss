/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/

/**
 * Capability data store.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilityStore', {
    extend: 'Ext.data.JsonStore',

    constructor: function (config) {
        var self = this,
            config = config || {},
            ST = Ext.data.SortTypes,
            storeUrl = Nexus.siesta.basePath + '/capabilities';

        Ext.apply(config, {
            url: storeUrl,
            id: 'capability.id',

            fields : [
                { name: 'id', mapping: 'capability.id' },
                { name: 'description', sortType: ST.asUCString },
                { name: 'notes',  mapping: 'capability.notes', sortType: ST.asUCString },
                { name: 'enabled', mapping: 'capability.enabled' },
                { name: 'active' },
                { name: 'error' },
                { name: 'typeName' },
                { name: 'typeId', mapping: 'capability.typeId'},
                { name: 'stateDescription' },
                { name: 'status' },
                { name: 'url', convert: function(newValue, rec) { return storeUrl + '/' + rec.capability.id; }},

            ],

            sortInfo: {
                field: 'typeName',
                direction: 'ASC'
            }
        });

        self.constructor.superclass.constructor.call(self, config);
    }

});
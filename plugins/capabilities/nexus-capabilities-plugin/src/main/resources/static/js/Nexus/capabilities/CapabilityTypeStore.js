/*
 * Copyright (c) 2008-2013 Sonatype, Inc.
 *
 * All rights reserved. Includes the third-party code listed at http://links.sonatype.com/products/nexus/pro/attributions
 * Sonatype and Sonatype Nexus are trademarks of Sonatype, Inc. Apache Maven is a trademark of the Apache Foundation.
 * M2Eclipse is a trademark of the Eclipse Foundation. All other trademarks are the property of their respective owners.
 */
/*global NX, Ext, Nexus*/

/**
 * Capability type data store.
 *
 * @since 2.7
 */
NX.define('Nexus.capability.CapabilityTypeStore', {
    extend: 'Ext.data.JsonStore',

    constructor: function (config) {
        var self = this,
            config = config || {},
            ST = Ext.data.SortTypes;

        Ext.apply(config, {
            url: Nexus.siesta.basePath + '/capabilities/types',
            id: 'id',

            fields : [
                { name: 'id' },
                { name: 'name' },
                { name: 'about' },
                { name: 'formFields' }
            ],

            sortInfo: {
                field: 'id',
                direction: 'ASC'
            }
        });

        self.constructor.superclass.constructor.call(self, config);
    }
});
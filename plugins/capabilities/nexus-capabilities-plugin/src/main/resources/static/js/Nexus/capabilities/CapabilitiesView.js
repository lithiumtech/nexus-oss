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
 * Capabilities master/detail view.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitiesView', {
  extend: 'Ext.Panel',

  mixins: [
    'Nexus.LogAwareMixin'
  ],

  requires: [
    'Nexus.capabilities.Icons',
    'Nexus.capabilities.CapabilitiesMediator',
    'Nexus.masterdetail.MasterDetail',
    'Nexus.masterdetail.EmptySelection',
    'Nexus.capabilities.CapabilitiesGrid',
    'Nexus.capabilities.CapabilityView'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this,
        icons = Nexus.capabilities.Icons,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    // force all data stores to refresh when the main capabilities view loads
    mediator.refresh();

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilitiesView',
      layout: 'border',
      items: NX.create('Nexus.masterdetail.MasterDetail',
          NX.create('Nexus.capabilities.CapabilitiesGrid', {
            region: 'center'
          }),
          NX.create('Nexus.capabilities.CapabilityView'),
          NX.create('Nexus.masterdetail.EmptySelection', {
            iconCls: icons.get('selectionEmpty').cls,
            entityType: 'capability'
          })
      )
    });

    self.constructor.superclass.initComponent.apply(self, arguments);
  }

}, function () {
  var type = this,
      sp = Sonatype.lib.Permissions;

  NX.log.debug('Adding global view: ' + type.$className);

  // install panel into main NX navigation
  Sonatype.Events.on('nexusNavigationInit', function (panel) {
    panel.add({
      enabled: sp.checkPermission('nexus:capabilities', sp.READ),
      sectionId: 'st-nexus-config',
      title: 'Capabilities',
      tabId: 'capabilities',
      tabCode: type
    });

    NX.log.debug('Registered global view: ' + type.$className);
  });
});
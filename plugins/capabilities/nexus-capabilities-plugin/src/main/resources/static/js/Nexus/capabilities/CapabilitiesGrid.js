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
/*global NX, Ext, Sonatype, Nexus*/

/**
 * Capabilities master grid.
 *
 * @since 2.7
 */
NX.define('Nexus.capabilities.CapabilitiesGrid', {
  extend: 'Ext.grid.GridPanel',

  mixins: [
    'Nexus.LogAwareMixin'
  ],

  requires: [
    'Nexus.capabilities.Icons',
    'Nexus.capabilities.CapabilitiesMediator',
    'Nexus.capabilities.CreateCapabilityWindow'
  ],

  /**
   * @override
   */
  initComponent: function () {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator,
        icons = Nexus.capabilities.Icons;

    mediator.capabilityStore.on('beforeload', self.rememberSelection, self);
    mediator.capabilityStore.on('load', self.recallSelection, self);
    mediator.capabilityTypeStore.on('load',
        function (store, records) {
          var self = this,
              sp = Sonatype.lib.Permissions,
              canCreate = sp.checkPermission('nexus:capabilities', sp.CREATE),
              addButton = self.getTopToolbar().getComponent('add');
          addButton.disable();
          if (records && records.length > 0 && canCreate) {
            addButton.enable();
          }
        }, self
    );

    Ext.apply(self, {
      cls: 'nx-capabilities-CapabilityGrid',
      ds: mediator.capabilityStore,
      stripeRows: true,
      loadMask: {
        msg: 'Loading...',
        msgCls: 'loading-indicator'
      },
      viewConfig: {
        emptyText: 'Click "Add" to configure a capability.',
        deferEmptyText: false
      },
      sm: NX.create('Ext.grid.RowSelectionModel', {
        singleSelect: true,
        listeners: {
          selectionchange: {
            fn: self.selectionChanged,
            scope: self
          }
        }
      }),

      columns: [
        {
          width: 30,
          resizable: false,
          sortable: false,
          fixed: true,
          hideable: false,
          menuDisabled: true,
          renderer: function (value, metaData, record) {
            return icons.iconFor(record.data).img;
          }
        },
        {
          id: 'typeName',
          width: 175,
          header: 'Type',
          dataIndex: 'typeName',
          sortable: true
        },
        {
          id: 'description',
          width: 250,
          header: 'Description',
          dataIndex: 'description',
          sortable: true
        },
        {
          id: 'notes',
          width: 175,
          header: 'Notes',
          dataIndex: 'notes',
          sortable: true
        }
      ],
      autoExpandColumn: 'notes',

      tbar: [
        {
          text: 'Refresh',
          tooltip: 'Refresh capabilities',
          iconCls: icons.get('refresh').cls,
          handler: function () {
            self.refresh();
          }
        },
        {
          text: 'New',
          itemId: 'add',
          iconCls: icons.get('capability_add').cls,
          tooltip: 'Add a new capability',
          handler: function () {
            self.addCapability();
          },
          disabled: true
        },
        {
          text: 'Duplicate',
          itemId: 'duplicate',
          iconCls: icons.get('capability_add').cls,
          tooltip: 'Duplicates selected capability',
          handler: function () {
            var selections = self.getSelectionModel().getSelections();
            if (selections.length > 0) {
              self.duplicateCapability(selections[0].data);
            }
          },
          disabled: true
        },
        {
          text: 'Delete',
          itemId: 'delete',
          iconCls: icons.get('capability_delete').cls,
          tooltip: 'Delete selected capability',
          handler: function (button) {
            var selections = self.getSelectionModel().getSelections();
            if (selections.length > 0) {
              self.deleteCapability(selections[0].data, button.btnEl);
            }
          },
          disabled: true
        }
      ]
    });

    self.constructor.superclass.initComponent.apply(self, arguments);

    self.on('rowcontextmenu', self.showMenu, self);
  },

  /**
   * @private
   */
  selectionChanged: function (sm) {
    var self = this,
        sp = Sonatype.lib.Permissions,
        duplicateButton = self.getTopToolbar().getComponent('duplicate'),
        deleteButton = self.getTopToolbar().getComponent('delete');

    duplicateButton.disable();
    deleteButton.disable();
    if (sm.getCount() !== 0) {
      if (sp.checkPermission('nexus:capabilities', sp.CREATE)) {
        duplicateButton.enable();
      }
      if (sp.checkPermission('nexus:capabilities', sp.DELETE)) {
        deleteButton.enable();
      }
    }
  },

  /**
   * @private
   */
  selectedRecords: undefined,

  /**
   * Remember what records are selected.
   *
   * @private
   */
  rememberSelection: function () {
    this.selectedRecords = this.getSelectionModel().getSelections();
  },

  /**
   * Recall selection from previous remembered selection.
   *
   * @private
   */
  recallSelection: function () {
    var self = this,
        toSelect = [];

    if (self.selectedRecords === undefined || self.selectedRecords.length === 0) {
      return;
    }

    Ext.each(self.selectedRecords, function (record) {
      record = self.getStore().getById(record.id);
      if (!Ext.isEmpty(record)) {
        toSelect.push(record);
      }
    });

    self.getSelectionModel().selectRecords(toSelect);
  },

  /**
   * Refreshes grid and selects a capability by id.
   *
   * @param capabilityId to be selected
   *
   * @private
   */
  refreshAndSelect: function (capabilityId) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    self.getSelectionModel().clearSelections();
    self.refresh();
    mediator.capabilityStore.on('load',
        function () {
          var record = self.getStore().getById(capabilityId);
          if (!Ext.isEmpty(record)) {
            self.getSelectionModel().selectRecords([record]);
          }
        },
        self, {single: true}
    );
  },

  /**
   * @private
   */
  refresh: function () {
    var mediator = Nexus.capabilities.CapabilitiesMediator;

    mediator.refresh();
  },

  /**
   * @private
   */
  deleteCapability: function (capability, animEl) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    Ext.Msg.show({
      title: 'Confirm deletion?',
      msg: mediator.describeCapability(capability),
      buttons: Ext.Msg.YESNO,
      animEl: animEl,
      icon: Ext.MessageBox.QUESTION,
      closeable: false,
      scope: self,
      fn: function (buttonName) {
        if (buttonName === 'yes' || buttonName === 'ok') {
          mediator.deleteCapability(capability,
              function () {
                mediator.showMessage('Capability deleted', mediator.describeCapability(capability));
                self.refresh();
              },
              function (response) {
                mediator.handleError(response, 'Capability could not be deleted');
                if (response.status === 404) {
                  self.refresh();
                }
              }
          );
        }
      }
    });
  },

  /**
   * @private
   */
  enableCapability: function (capability) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    mediator.enableCapability(capability,
        function () {
          mediator.showMessage('Capability enabled', mediator.describeCapability(capability));
          self.refresh();
        },
        function (response) {
          mediator.handleError(response, 'Capability could not be enabled');
          if (response.status === 404) {
            self.refresh();
          }
        }
    );
  },

  /**
   * @private
   */
  disableCapability: function (capability) {
    var self = this,
        mediator = Nexus.capabilities.CapabilitiesMediator;

    mediator.disableCapability(capability,
        function () {
          mediator.showMessage('Capability disabled', mediator.describeCapability(capability));
          self.refresh();
        },
        function (response) {
          mediator.handleError(response, 'Capability could not be disabled');
          if (response.status === 404) {
            self.refresh();
          }
        }
    );
  },

  /**
   * @private
   */
  addCapability: function () {
    NX.create(
        'Nexus.capabilities.CreateCapabilityWindow', this.refreshAndSelect.createDelegate(this)
    ).show();
  },

  /**
   * @private
   */
  duplicateCapability: function (capability) {
    NX.create(
        'Nexus.capabilities.CreateCapabilityWindow', this.refreshAndSelect.createDelegate(this)
    ).show().importCapability(capability);
  },

  /**
   * @private
   * Grid row where context menu was last activated.
   */
  contextMenuRow: undefined,

  /**
   * @private
   */
  showMenu: function (grid, index, e) {
    var self = this,
        sp = Sonatype.lib.Permissions,
        icons = Nexus.capabilities.Icons,
        row = grid.view.getRow(index),
        capability = self.store.getAt(index).data;

    self.hideMenu();

    self.contextMenuRow = row;

    Ext.fly(row).addClass('x-node-ctx');

    var menu = new Ext.menu.Menu({
      items: [
        {
          text: 'Refresh',
          iconCls: icons.get('refresh').cls,
          scope: self,
          handler: self.refresh.createDelegate(self)
        }
      ]
    });

    if (sp.checkPermission('nexus:capabilities', sp.EDIT)) {
      menu.add('-');
      if (capability.enabled) {
        menu.add({
          text: 'Disable',
          iconCls: icons.get('disable').cls,
          scope: self,
          handler: self.disableCapability.createDelegate(self, [capability])
        });
      }
      else {
        menu.add({
          text: 'Enable',
          iconCls: icons.get('enable').cls,
          scope: self,
          handler: self.enableCapability.createDelegate(self, [capability])
        });
      }
    }

    if (sp.checkPermission('nexus:capabilities', sp.CREATE)) {
      menu.add('-');
      menu.add({
        text: 'Duplicate',
        iconCls: icons.get('capability_add').cls,
        scope: self,
        handler: self.duplicateCapability.createDelegate(self, [capability])
      });
    }

    if (sp.checkPermission('nexus:capabilities', sp.DELETE)) {
      if (!sp.checkPermission('nexus:capabilities', sp.CREATE)) {
        menu.add('-');
      }
      menu.add({
        text: 'Delete',
        iconCls: icons.get('capability_delete').cls,
        scope: self,
        handler: self.deleteCapability.createDelegate(self, [capability])
      });
    }

    e.stopEvent();

    self.getSelectionModel().selectRow(index, false);

    menu.on('hide', self.hideMenu, self);
    menu.showAt(e.getXY());
  },

  /**
   * @private
   */
  hideMenu: function () {
    var self = this;

    if (self.contextMenuRow) {
      Ext.fly(self.contextMenuRow).removeClass('x-node-ctx');
      this.contextMenuRow = null;
    }
  }

});

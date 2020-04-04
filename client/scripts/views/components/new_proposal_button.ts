import m from 'mithril';
import $ from 'jquery';
import _ from 'lodash';
import { Tooltip, Button, Icon, Icons, PopoverMenu, MenuItem, MenuDivider } from 'construct-ui';

import app from 'state';
import { ProposalType } from 'identifiers';
import { ChainClass } from 'models/models';
import { CosmosAccount } from 'controllers/chain/cosmos/account';
import { SubstrateAccount } from 'controllers/chain/substrate/account';
import NewProposalModal from 'views/modals/proposals';

const NewProposalButton: m.Component<{ fluid: boolean }> = {
  view: (vnode) => {
    const activeAccount = app.vm.activeAccount;
    const fluid = !!vnode.attrs.fluid;

    return app.isLoggedIn() && m(PopoverMenu, {
      class: 'NewProposalButton',
      trigger: activeAccount ? m(Button, {
        iconLeft: Icons.PLUS,
        intent: 'primary',
        label: 'New post',
        fluid,
      }) : m(Tooltip, {
        content: 'Link an address to post',
        trigger: m(Button, {
          iconLeft: Icons.PLUS,
          intent: 'primary',
          label: 'New post',
          class: 'cui-disabled',
          style: 'cursor: pointer !important',
          fluid,
        }),
      }),
      position: 'bottom-end',
      closeOnContentClick: true,
      menuAttrs: {
        align: 'left',
      },
      content: [
        app.activeId() && m(MenuItem, {
          onclick: () => { m.route.set(`/${app.activeId()}/new/thread`) },
          label: 'New thread',
        }),

        (activeAccount instanceof CosmosAccount || activeAccount instanceof SubstrateAccount) && m(MenuDivider),
        activeAccount instanceof CosmosAccount && m(MenuItem, {
          onclick: (e) => app.modals.create({
            modal: NewProposalModal,
            data: { typeEnum: ProposalType.CosmosProposal }
          }),
          label: 'New proposal'
        }),
        activeAccount instanceof SubstrateAccount && activeAccount.chainClass === ChainClass.Edgeware && m(MenuItem, {
          onclick: () => { m.route.set(`/${activeAccount.chain.id}/new/signaling`); },
          label: 'New signaling proposal'
        }),

        activeAccount instanceof SubstrateAccount && m(MenuItem, {
          onclick: (e) => app.modals.create({
            modal: NewProposalModal,
            data: { typeEnum: ProposalType.SubstrateTreasuryProposal }
          }),
          label: 'New treasury proposal'
        }),
        activeAccount instanceof SubstrateAccount && m(MenuItem, {
          onclick: (e) => app.modals.create({
            modal: NewProposalModal,
            data: { typeEnum: ProposalType.SubstrateDemocracyProposal }
          }),
          label: 'New democracy proposal'
        }),
        activeAccount instanceof SubstrateAccount && m(MenuItem, {
          class: activeAccount.isCouncillor ? '' : 'disabled',
          onclick: (e) => app.modals.create({
            modal: NewProposalModal,
            data: { typeEnum: ProposalType.SubstrateCollectiveProposal }
          }),
          label: 'New council motion'
        }),
      ],
    });
  }
};

export default NewProposalButton;
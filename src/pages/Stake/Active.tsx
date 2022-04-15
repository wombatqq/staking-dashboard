// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import { Button } from '../../library/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

export const Active = () => {

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const nominations = getAccountNominations(activeAccount);
  const { active, total } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  const remaining = total - active - totalUnlocking;

  const items = [
    {
      label: "Bonded",
      value: planckToDot(active),
      unit: network.unit,
      format: "number",
    },
    {
      label: "Free",
      value: planckToDot(remaining),
      unit: network.unit,
      format: "number",
    },
    {
      label: "Status",
      value: nominations.length,
      unit: `Nomination${nominations.length === 1 ? `` : `s`}`,
      format: 'number',
    },
  ];


  return (
    <>
      <StatBoxList title="This Session" items={items} />
      <PageRowWrapper noVerticalSpacer>


        <SecondaryWrapper style={{ height: 290 }}>
          <SectionWrapper >
            <ManageBond />
          </SectionWrapper>
        </SecondaryWrapper>

        <MainWrapper paddingLeft style={{ flex: 1 }}>
          <SectionWrapper style={{ height: 290 }} >
            <div className='head'>
              <h4>Status</h4>
              <h2>Active</h2>

              <div style={{ width: '100%', borderBottom: '1px solid #ddd', margin: '1.5rem 0' }}></div>
              <h4>Reward Destination</h4>
              <h2>
                <FontAwesomeIcon
                  icon={faRedoAlt}
                  transform='shrink-4'
                />
                &nbsp;Back to Staking &nbsp;<div><Button thin inline primary title='Update' /></div>
              </h2>
            </div>
          </SectionWrapper>
        </MainWrapper>


      </PageRowWrapper>

      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Nominations />
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Active;
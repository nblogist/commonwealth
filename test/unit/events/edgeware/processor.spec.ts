import chai from 'chai';
import { Header, EventRecord } from '@polkadot/types/interfaces';

import Processor from '../../../../shared/events/edgeware/processor';
import { SubstrateEventKindMap } from '../../../../shared/events/edgeware/types';
import { constructFakeApi } from './testUtil';

const { assert } = chai;

interface IFakeEvent {
  section: string;
  method: string;
  data: any;
}

const constructFakeBlock = (blockNumber: number, events: IFakeEvent[]) => {
  return {
    header: {
      hash: blockNumber,
      number: blockNumber,
    } as unknown as Header,
    events: events.map(
      (event) => ({ event } as unknown as EventRecord)
    ),
  };
};

describe('Edgeware Event Processor Tests', () => {
  it('should process blocks into events', (done) => {
    // setup fake data
    const fakeEvents: IFakeEvent[] = [
      {
        section: 'staking',
        method: 'Slash',
        data: [ 'Alice', '10000' ],
      },
      {
        section: 'staking',
        method: 'Bonded',
        data: [ 'Alice', '10000' ],
      },
      {
        section: 'democracy',
        method: 'Proposed',
        data: [ '4', '100000' ],
      },
      {
        section: 'democracy',
        method: 'Started',
        data: [ '5' ],
      },
    ];

    const fakeBlocks = [
      constructFakeBlock(1, fakeEvents.slice(0, 3)),
      constructFakeBlock(2, fakeEvents.slice(3, 4)),
    ];

    const api = constructFakeApi({
      referendumInfoOf: async (idx) => {
        if (+idx === 5) {
          return {
            isSome: true,
            isNone: false,
            unwrap: () => {
              return {
                end: '123',
              };
            },
          };
        } else {
          throw new Error('bad referendum idx');
        }
      }
    });

    // run test
    const processor = new Processor(api);
    Promise.all(
      fakeBlocks.map((block) => processor.process(block))
    ).then((results) => {
      assert.deepEqual(results[0], [
        {
          /* eslint-disable dot-notation */
          data: {
            kind: SubstrateEventKindMap['slash'],
            validator: 'Alice',
            amount: '10000',
          },
          blockNumber: 1,
        },
        {
          data: {
            kind: SubstrateEventKindMap['democracy-proposed'],
            proposalIndex: 4,
            deposit: '100000',
          },
          blockNumber: 1,
        },
      ]);
      assert.deepEqual(results[1], [
        {
          data: {
            kind: SubstrateEventKindMap['democracy-started'],
            referendumIndex: 5,
            endBlock: 123,
          },
          blockNumber: 2,
        },
      ]);
      done();
    });
  });

  // TODO: fail tests
});
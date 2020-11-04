import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentName, setCurrentName] = useState("");
  const [formName, setFormName] = useState("");
  const [currentNumber, setCurrentNumber] = useState(0);
  const [formNumber, setFormNumber] = useState(0);


  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.favNumber(newValue => {
      if (newValue.isNone) {
        setCurrentName('<None>')
        setCurrentNumber(0)
      } else {
        console.log(newValue + " ")
        setCurrentName(newValue.Name.toHuman())
        setCurrentNumber(newValue.Fav_Number.toString())
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>Favorite Number</h1>
      <Card centered>
      <Card.Content textAlign='center'>
        <Card.Header content={`Username: ${currentName}`} />
          <Statistic
            label='Favorite Number'
            value={currentNumber}
          />
        </Card.Content>
      </Card>
      <Form>
      <Form.Field>
          <Input
            label='Name'
            state='newValue'
            type='string'
            onChange={(_, { value }) => setFormName(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Favorite Number'
            state='newValue'
            type='number'
            onChange={(_, { value }) => setFormNumber(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Save'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'addNumber',
              inputParams: [{ "Name": formName, "Fav_Number": formNumber}],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function FavNumber (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.favNumber
    ? <Main {...props} /> : null);
}
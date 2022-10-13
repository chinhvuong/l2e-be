import Web3 from 'web3';

const main = async () => {
  const web3 = new Web3();
  const signature = web3.eth.accounts.sign(
    'Hello',
    '34289fee63c5cbe48f001efd27a7cb3a9ba27b3029286eb527ce37a9f8999f8c',
  );
  console.log(signature);

  const recover = web3.eth.accounts.recover('Hello', signature.signature);
  console.log('🚀 ~ file: script.ts ~ line 9 ~ main ~ recover', recover);
};

main();

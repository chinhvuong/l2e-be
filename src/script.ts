import Web3 from 'web3';

const main = async () => {
  const web3 = new Web3();
  const signature = web3.eth.accounts.sign(
    'Hello',
    'ff859483adfec0273d73cb8d4e3094b5bc1bc4f8e6a0dad9ff854a5afd89ade7',
  );
  console.log(signature);

  const recover = web3.eth.accounts.recover('Hello', signature.signature);
  console.log('🚀 ~ file: script.ts ~ line 9 ~ main ~ recover', recover);
};
// npx ts-node src/script.ts
main();

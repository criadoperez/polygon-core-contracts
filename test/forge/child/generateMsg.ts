import { ethers } from "ethers";
import * as mcl from "../../../ts/mcl";
const input = process.argv[2];

const DOMAIN = ethers.utils.arrayify(ethers.utils.hexlify(ethers.utils.randomBytes(32)));
let blockHashs: any[] = [];
let signatures: any[] = [];

async function generateMsg() {
  await mcl.init();
  const message = ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator"));
  const { pubkey, secret } = mcl.newKeyPair();
  const { signature, messagePoint } = mcl.sign(message, secret, DOMAIN);

  const parsedPubkey = mcl.g2ToHex(pubkey);
  const parsedSignature = mcl.g1ToHex(signature);

  const messagePointForInit = mcl.g1ToHex(
    mcl.hashToPoint(ethers.utils.hexlify(ethers.utils.toUtf8Bytes("polygon-v3-validator")), DOMAIN)
  );

  generateSignature();

  const output = ethers.utils.defaultAbiCoder.encode(
    ["uint256[2]", "uint256[2]", "uint256[4]", "bytes32[]", "bytes[]"],
    [messagePointForInit, parsedSignature, parsedPubkey, blockHashs, signatures]
  );
}

function generateSignature() {
  const blockNumber = 0;
  const pbftRound = 0;
  const epochId = 0;
  const blockHash1 = ethers.utils.randomBytes(32);
  const blockHash2 = ethers.utils.randomBytes(32);
  const signature1 = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint", "uint", "uint", "bytes32"],
      [blockNumber, pbftRound, epochId, blockHash1]
    )
  );

  const signature2 = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["uint", "uint", "uint", "bytes32"],
      [blockNumber, pbftRound, epochId, blockHash2]
    )
  );

  blockHashs.push(blockHash1);
  signatures.push(signature1);
  blockHashs.push(blockHash2);
  signatures.push(signature2);
}
generateMsg();

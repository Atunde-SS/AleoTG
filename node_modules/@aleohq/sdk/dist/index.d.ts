import { VerifyingKey } from "@aleohq/wasm";
declare const KEY_STORE = "https://testnet3.parameters.aleo.org/";
declare const CREDITS_PROGRAM_KEYS: {
    bond_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.bondPublicVerifier;
    };
    claim_unbond_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.claimUnbondPublicVerifier;
    };
    fee_private: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.feePrivateVerifier;
    };
    fee_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.feePublicVerifier;
    };
    inclusion: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.inclusionVerifier;
    };
    join: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.joinVerifier;
    };
    set_validator_state: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.setValidatorStateVerifier;
    };
    split: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.splitVerifier;
    };
    transfer_private: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.transferPrivateVerifier;
    };
    transfer_private_to_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.transferPrivateToPublicVerifier;
    };
    transfer_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.transferPublicVerifier;
    };
    transfer_public_to_private: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.transferPublicToPrivateVerifier;
    };
    unbond_delegator_as_validator: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.unbondDelegatorAsValidatorVerifier;
    };
    unbond_public: {
        locator: string;
        prover: string;
        verifier: string;
        verifyingKey: typeof VerifyingKey.unbondPublicVerifier;
    };
};
declare const PRIVATE_TRANSFER_TYPES: Set<string>;
declare const VALID_TRANSFER_TYPES: Set<string>;
declare const PRIVATE_TRANSFER: Set<string>;
declare const PRIVATE_TO_PUBLIC_TRANSFER: Set<string>;
declare const PUBLIC_TRANSFER: Set<string>;
declare const PUBLIC_TO_PRIVATE_TRANSFER: Set<string>;
declare function logAndThrow(message: string): Error;
import { Account } from "./account";
import { AleoNetworkClient, ProgramImports } from "./network-client";
import { Block } from "./models/block";
import { Execution } from "./models/execution";
import { Input } from "./models/input";
import { Output } from "./models/output";
import { TransactionModel } from "./models/transactionModel";
import { Transition } from "./models/transition";
import { AleoKeyProvider, AleoKeyProviderParams, AleoKeyProviderInitParams, CachedKeyPair, FunctionKeyPair, FunctionKeyProvider, KeySearchParams } from "./function-key-provider";
import { OfflineKeyProvider, OfflineSearchParams } from "./offline-key-provider";
import { BlockHeightSearch, NetworkRecordProvider, RecordProvider, RecordSearchParams } from "./record-provider";
declare function initializeWasm(): Promise<void>;
export { createAleoWorker } from "./managed-worker";
export { ProgramManager } from "./program-manager";
export { Address, Execution as FunctionExecution, ExecutionResponse, Field, OfflineQuery, PrivateKey, PrivateKeyCiphertext, Program, ProgramManager as ProgramManagerBase, ProvingKey, RecordCiphertext, RecordPlaintext, Signature, Transaction, VerifyingKey, ViewKey, initThreadPool, verifyFunctionExecution, } from "@aleohq/wasm";
export { initializeWasm };
export { Account, AleoKeyProvider, AleoKeyProviderParams, AleoKeyProviderInitParams, AleoNetworkClient, Block, BlockHeightSearch, CachedKeyPair, Execution, FunctionKeyPair, FunctionKeyProvider, Input, KeySearchParams, NetworkRecordProvider, ProgramImports, OfflineKeyProvider, OfflineSearchParams, Output, RecordProvider, RecordSearchParams, TransactionModel, Transition, CREDITS_PROGRAM_KEYS, KEY_STORE, PRIVATE_TRANSFER, PRIVATE_TO_PUBLIC_TRANSFER, PRIVATE_TRANSFER_TYPES, PUBLIC_TRANSFER, PUBLIC_TO_PRIVATE_TRANSFER, VALID_TRANSFER_TYPES, logAndThrow, };

import { FunctionKeyProvider, KeySearchParams, FunctionKeyPair, CachedKeyPair, ProvingKey, VerifyingKey } from "./index";
/**
 * Search parameters for the offline key provider. This class implements the KeySearchParams interface and includes
 * a convenience method for creating a new instance of this class for each function of the credits.aleo program.
 *
 * @example
 * // If storing a key for a custom program function
 * offlineSearchParams = new OfflineSearchParams("myprogram.aleo/myfunction");
 *
 * // If storing a key for a credits.aleo program function
 * unbondDelegatorAsValidatorSearchParams = OfflineSearchParams.unbondDelegatorAsValidatorKeyParams();
 */
declare class OfflineSearchParams implements KeySearchParams {
    cacheKey: string | undefined;
    verifyCreditsKeys: boolean | undefined;
    /**
     * Create a new OfflineSearchParams instance.
     *
     * @param {string} cacheKey - Key used to store the local function proving & verifying keys. This should be stored
     * under the naming convention "programName/functionName" (i.e. "myprogram.aleo/myfunction")
     * @param {boolean} verifyCreditsKeys - Whether to verify the keys against the credits.aleo program,
     * defaults to false, but should be set to true if using keys from the credits.aleo program
     */
    constructor(cacheKey: string, verifyCreditsKeys?: boolean);
    /**
     * Create a new OfflineSearchParams instance for the bond_public function of the credits.aleo program.
     */
    static bondPublicKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the claim_unbond_public function of the
     */
    static claimUnbondPublicKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the fee_private function of the credits.aleo program.
     */
    static feePrivateKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the fee_public function of the credits.aleo program.
     */
    static feePublicKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the inclusion prover function.
     */
    static inclusionKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the join function of the credits.aleo program.
     */
    static joinKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the set_validator_state function of the credits.aleo program.
     */
    static setValidatorStateKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the split function of the credits.aleo program.
     */
    static splitKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the transfer_private function of the credits.aleo program.
     */
    static transferPrivateKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the transfer_private_to_public function of the credits.aleo program.
     */
    static transferPrivateToPublicKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the transfer_public function of the credits.aleo program.
     */
    static transferPublicKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the transfer_public_to_private function of the credits.aleo program.
     */
    static transferPublicToPrivateKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the unbond_delegator_as_validator function of the credits.aleo program.
     */
    static unbondDelegatorAsValidatorKeyParams(): OfflineSearchParams;
    /**
     * Create a new OfflineSearchParams instance for the unbond_delegator function of the credits.aleo program.
     */
    static unbondPublicKeyParams(): OfflineSearchParams;
}
/**
 * A key provider meant for building transactions offline on devices such as hardware wallets. This key provider is not
 * able to contact the internet for key material and instead relies on the user to insert Aleo function proving &
 * verifying keys from local storage prior to usage.
 *
 * @example
 * // Create an offline program manager
 * const programManager = new ProgramManager();
 *
 * // Create a temporary account for the execution of the program
 * const account = new Account();
 * programManager.setAccount(account);
 *
 * // Create the proving keys from the key bytes on the offline machine
 * console.log("Creating proving keys from local key files");
 * const program = "program hello_hello.aleo; function hello: input r0 as u32.public; input r1 as u32.private; add r0 r1 into r2; output r2 as u32.private;";
 * const myFunctionProver = await getLocalKey("/path/to/my/function/hello_hello.prover");
 * const myFunctionVerifier = await getLocalKey("/path/to/my/function/hello_hello.verifier");
 * const feePublicProvingKeyBytes = await getLocalKey("/path/to/credits.aleo/feePublic.prover");
 *
 * myFunctionProvingKey = ProvingKey.fromBytes(myFunctionProver);
 * myFunctionVerifyingKey = VerifyingKey.fromBytes(myFunctionVerifier);
 * const feePublicProvingKey = ProvingKey.fromBytes(feePublicKeyBytes);
 *
 * // Create an offline key provider
 * console.log("Creating offline key provider");
 * const offlineKeyProvider = new OfflineKeyProvider();
 *
 * // Cache the keys
 * // Cache the proving and verifying keys for the custom hello function
 * OfflineKeyProvider.cacheKeys("hello_hello.aleo/hello", myFunctionProvingKey, myFunctionVerifyingKey);
 *
 * // Cache the proving key for the fee_public function (the verifying key is automatically cached)
 * OfflineKeyProvider.insertFeePublicKey(feePublicProvingKey);
 *
 * // Create an offline query using the latest state root in order to create the inclusion proof
 * const offlineQuery = new OfflineQuery("latestStateRoot");
 *
 * // Insert the key provider into the program manager
 * programManager.setKeyProvider(offlineKeyProvider);
 *
 * // Create the offline search params
 * const offlineSearchParams = new OfflineSearchParams("hello_hello.aleo/hello");
 *
 * // Create the offline transaction
 * const offlineExecuteTx = <Transaction>await this.buildExecutionTransaction("hello_hello.aleo", "hello", 1, false, ["5u32", "5u32"], undefined, offlineSearchParams, undefined, undefined, undefined, undefined, offlineQuery, program);
 *
 * // Broadcast the transaction later on a machine with internet access
 * const networkClient = new AleoNetworkClient("https://api.explorer.aleo.org/v1");
 * const txId = await networkClient.broadcastTransaction(offlineExecuteTx);
 */
declare class OfflineKeyProvider implements FunctionKeyProvider {
    cache: Map<string, CachedKeyPair>;
    constructor();
    /**
     * Get bond_public function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the bond_public function
     */
    bondPublicKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Cache a set of keys. This will overwrite any existing keys with the same keyId. The user can check if a keyId
     * exists in the cache using the containsKeys method prior to calling this method if overwriting is not desired.
     *
     * @param {string} keyId access key for the cache
     * @param {FunctionKeyPair} keys keys to cache
     */
    cacheKeys(keyId: string, keys: FunctionKeyPair): void;
    /**
     * Get unbond_public function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the unbond_public function
     */
    claimUnbondPublicKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Get arbitrary function key from the offline key provider cache.
     *
     * @param {KeySearchParams | undefined} params - Optional search parameters for the key provider
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the specified program
     *
     * @example
     * /// First cache the keys from local offline resources
     * const offlineKeyProvider = new OfflineKeyProvider();
     * const myFunctionVerifyingKey = VerifyingKey.fromString("verifier...");
     * const myFunctionProvingKeyBytes = await readBinaryFile('./resources/myfunction.prover');
     * const myFunctionProvingKey = ProvingKey.fromBytes(myFunctionProvingKeyBytes);
     *
     * /// Cache the keys for future use with a memorable locator
     * offlineKeyProvider.cacheKeys("myprogram.aleo/myfunction", [myFunctionProvingKey, myFunctionVerifyingKey]);
     *
     * /// When they're needed, retrieve the keys from the cache
     *
     * /// First create a search parameter object with the same locator used to cache the keys
     * const keyParams = new OfflineSearchParams("myprogram.aleo/myfunction");
     *
     * /// Then retrieve the keys
     * const [myFunctionProver, myFunctionVerifier] = await offlineKeyProvider.functionKeys(keyParams);
     */
    functionKeys(params?: KeySearchParams): Promise<FunctionKeyPair | Error>;
    /**
     * Determines if the keys for a given credits function match the expected keys.
     *
     * @returns {boolean} Whether the keys match the expected keys
     */
    verifyCreditsKeys(locator: string, provingKey: ProvingKey, verifyingKey: VerifyingKey): boolean;
    /**
     * Get fee_private function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the join function
     */
    feePrivateKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Get fee_public function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the join function
     */
    feePublicKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Get join function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the join function
     */
    joinKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Get split function keys from the credits.aleo program. The keys must be cached prior to calling this
     * method for it to work.
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the join function
     */
    splitKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Get keys for a variant of the transfer function from the credits.aleo program.
     *
     *
     * @param {string} visibility Visibility of the transfer function (private, public, privateToPublic, publicToPrivate)
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the specified transfer function
     *
     * @example
     * // Create a new OfflineKeyProvider
     * const offlineKeyProvider = new OfflineKeyProvider();
     *
     * // Cache the keys for future use with the official locator
     * const transferPublicProvingKeyBytes = await readBinaryFile('./resources/transfer_public.prover.a74565e');
     * const transferPublicProvingKey = ProvingKey.fromBytes(transferPublicProvingKeyBytes);
     *
     * // Cache the transfer_public keys for future use with the OfflinKeyProvider's convenience method for
     * // transfer_public (the verifying key will be cached automatically)
     * offlineKeyProvider.insertTransferPublicKeys(transferPublicProvingKey);
     *
     * /// When they're needed, retrieve the keys from the cache
     * const [transferPublicProvingKey, transferPublicVerifyingKey] = await keyProvider.transferKeys("public");
     */
    transferKeys(visibility: string): Promise<FunctionKeyPair | Error>;
    /**
     * Get unbond_public function keys from the credits.aleo program
     *
     * @returns {Promise<FunctionKeyPair | Error>} Proving and verifying keys for the join function
     */
    unBondPublicKeys(): Promise<FunctionKeyPair | Error>;
    /**
     * Insert the proving and verifying keys for the bond_public function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for bond_public before inserting them into the cache.
     *
     * @param provingKey
     */
    insertBondPublicKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the claim_unbond_public function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for claim_unbond_public before inserting them into the cache.
     *
     * @param provingKey
     */
    insertClaimUnbondPublicKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the fee_private function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for fee_private before inserting them into the cache.
     *
     * @param provingKey
     */
    insertFeePrivateKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the fee_public function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for fee_public before inserting them into the cache.
     *
     * @param provingKey
     */
    insertFeePublicKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the join function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for join before inserting them into the cache.
     *
     * @param provingKey
     */
    insertJoinKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the set_validator_state function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for set_validator_state before inserting them into the cache.
     *
     * @param provingKey
     */
    insertSetValidatorStateKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the split function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for split before inserting them into the cache.
     *
     * @param provingKey
     */
    insertSplitKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the transfer_private function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for transfer_private before inserting them into the cache.
     *
     * @param provingKey
     */
    insertTransferPrivateKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the transfer_private_to_public function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for transfer_private_to_public before inserting them into the cache.
     *
     * @param provingKey
     */
    insertTransferPrivateToPublicKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the transfer_public function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for transfer_public before inserting them into the cache.
     *
     * @param provingKey
     */
    insertTransferPublicKeys(provingKey: ProvingKey): void;
    /**
     * Insert the proving and verifying keys for the transfer_public_to_private function into the cache. Only the proving key needs
     * to be inserted, the verifying key is automatically inserted by the SDK. This function will automatically check
     * that the keys match the expected checksum for transfer_public_to_private before inserting them into the cache.
     *
     * @param provingKey
     */
    insertTransferPublicToPrivateKeys(provingKey: ProvingKey): void;
    insertUnbondDelegatorAsValidatorKeys(provingKey: ProvingKey): void;
    insertUnbondPublicKeys(provingKey: ProvingKey): void;
}
export { OfflineKeyProvider, OfflineSearchParams };

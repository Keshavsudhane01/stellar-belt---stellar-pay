#![no_std]
use soroban_sdk::{
  contract, contractimpl, contracttype, token,
  Env, Address, Vec, Symbol, symbol_short, log
};

#[contracttype]
pub enum DataKey {
  Admin,
  RewardContract,
  TotalSplits,
}

#[contract]
pub struct PaymentSplitter;

#[contractimpl]
impl PaymentSplitter {

  pub fn initialize(env: Env, admin: Address, reward_contract: Address) {
    admin.require_auth();
    env.storage().instance().set(&DataKey::Admin, &admin);
    env.storage().instance().set(&DataKey::RewardContract, &reward_contract);
    env.storage().instance().set(&DataKey::TotalSplits, &0u32);
  }

  pub fn split_payment(
    env: Env,
    payer: Address,
    token_id: Address,
    recipients: Vec<Address>,
    total_amount: i128,
  ) -> Vec<i128> {
    payer.require_auth();
    assert!(!recipients.is_empty(), "Recipients cannot be empty");
    assert!(total_amount > 0, "Amount must be positive");

    let token_client = token::Client::new(&env, &token_id);
    let share = total_amount / recipients.len() as i128;
    let mut amounts = Vec::new(&env);

    for recipient in recipients.iter() {
      token_client.transfer(&payer, &recipient, &share);
      amounts.push_back(share);
      log!(&env, "Paid {} to {}", share, recipient);
    }

    // Inter-contract call: mint reward token for the payer
    let reward_contract: Address = env.storage().instance()
      .get(&DataKey::RewardContract).unwrap();
    let reward_client = crate::reward::Client::new(&env, &reward_contract);
    reward_client.mint_reward(&payer, &(recipients.len() as i128));

    // Update total splits count
    let total: u32 = env.storage().instance()
      .get(&DataKey::TotalSplits).unwrap_or(0);
    env.storage().instance().set(&DataKey::TotalSplits, &(total + 1));

    env.events().publish(
      (symbol_short!("SPLIT"),),
      (payer, recipients.len() as u32, total_amount)
    );

    amounts
  }

  pub fn get_total_splits(env: Env) -> u32 {
    env.storage().instance().get(&DataKey::TotalSplits).unwrap_or(0)
  }
}

mod reward {
  soroban_sdk::contractimport!(
    file = "../../reward/target/wasm32-unknown-unknown/release/reward.wasm"
  );
}

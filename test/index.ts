import { ethers } from "hardhat";
import { getContracts } from "../scripts/src/lib/get-contracts";
import { setupClassicalRegistrarController, setupDefaultWrapper, setupMortgage, setupPublicResolver, setupRegistrar, setupRegistry, setupRoot } from "../scripts/src/setup";
import {
  deployClassicalRegistrarController,
  deployMortgage,
  deployPublicResolver,
  deployRegistrar,
  deployRegistry,
  deployRoot,
  deployTokenMock,
  deployWrapper,
} from "../scripts/src/deploy";
import { loadFixture } from "ethereum-waffle";
import * as luxon from "luxon";
import { expect } from "chai";
import { IRegistry__factory, PublicResolver } from "../typechain";
import { Mortgage } from "../typechain/Mortgage";

describe("Deploy & Setup", function () {
  async function deployAndSetup() {
    const [signer] = await ethers.getSigners();
    const chainId = await signer.getChainId();
    let contracts = await getContracts(signer);
    await deployRegistry({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployWrapper("EDNS Domains", "EDNS", { signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployPublicResolver({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployRegistrar({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployRoot({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployTokenMock({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployClassicalRegistrarController({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await deployMortgage({ signer, chainId, contracts });
    contracts = await getContracts(signer);
    await setupRegistry({ signer, chainId, contracts });
    await setupDefaultWrapper({ signer, chainId, contracts });
    await setupPublicResolver({ signer, chainId, contracts });
    await setupRegistrar({ signer, chainId, contracts });
    await setupRoot({ signer, chainId, contracts });
    await setupClassicalRegistrarController({ signer, chainId, contracts });
    await setupMortgage({ signer, chainId, contracts });
    return { contracts };
  }

  it("All Contracts are deployed and finished setup", async function () {
    await deployAndSetup();
  });

  it("Register a classical '._ether' domain", async function () {
    const [master_signer, signer_1] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-1`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx1.wait();

    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);
  });

  it("Transfer Ownership to another address", async function () {
    const [master_signer, signer_1, signer_2] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-2`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx1.wait();

    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);

    const tx2 = await Registry.connect(signer_1)["setOwner(bytes32,bytes32,address)"](_name_, _tld_, signer_2.address);
    await tx2.wait();
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_2.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_2.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);
  });

  it("Create a `Host` record", async function () {
    const [master_signer, signer_1] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);
    const host = `i-am-host-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-3`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx1.wait();

    const _host_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(host));
    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);

    const tx2 = await Registry.connect(signer_1)["setRecord(bytes,bytes,bytes,uint16)"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      0,
    );
    await tx2.wait();
    expect(await Registry.connect(signer_1)["isExists(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_)).to.equal(true);
    expect(await Registry.connect(signer_1)["getUser(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry.connect(signer_1)["getUserExpiry(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User Expiry").to.equal(expiry);
  });

  it("Set a `Text` record in `PublicResolver`", async function () {
    const [master_signer, signer_1] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);
    const host = `i-am-host-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-4`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    if (!contracts.PublicResolver) throw new Error("`PublicResolver` missing");

    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx1.wait();

    const _host_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(host));
    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);

    const tx2 = await Registry.connect(signer_1)["setRecord(bytes,bytes,bytes,uint16)"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      0,
    );
    await tx2.wait();
    expect(await Registry.connect(signer_1)["isExists(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_)).to.equal(true);
    expect(await Registry.connect(signer_1)["getUser(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry.connect(signer_1)["getUserExpiry(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User Expiry").to.equal(expiry);

    const iso = luxon.DateTime.now().toISO() || "---";

    const tx3 = await contracts.PublicResolver.connect(signer_1)["setText"](ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), iso);
    await tx3.wait();

    expect(await contracts.PublicResolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld))).to.equal(iso);
  });

  it("Set multiple records in `PublicResolver`", async function () {
    const [master_signer, signer_1] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);
    const host = `i-am-host-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-5`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    if (!contracts.PublicResolver) throw new Error("`PublicResolver` missing");

    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx1.wait();

    const _host_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(host));
    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);

    const tx2 = await Registry.connect(signer_1)["setRecord(bytes,bytes,bytes,uint16)"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      0,
    );
    await tx2.wait();
    expect(await Registry.connect(signer_1)["isExists(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_)).to.equal(true);
    expect(await Registry.connect(signer_1)["getUser(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry.connect(signer_1)["getUserExpiry(bytes32,bytes32,bytes32)"](_host_, _name_, _tld_), "Same User Expiry").to.equal(expiry);

    const iso = luxon.DateTime.now().toISO() || "---";

    const tx3 = await contracts.PublicResolver.connect(signer_1)["setText"](ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), iso);
    await tx3.wait();

    expect(await contracts.PublicResolver.getText(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld))).to.equal(iso);

    const tx4 = await contracts.PublicResolver.connect(signer_1)["setTypedText"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      ethers.utils.toUtf8Bytes("iso_timestamp"),
      iso,
    );
    await tx4.wait();

    expect(
      await contracts.PublicResolver.getTypedText(
        ethers.utils.toUtf8Bytes(host),
        ethers.utils.toUtf8Bytes(name),
        ethers.utils.toUtf8Bytes(tld),
        ethers.utils.toUtf8Bytes("iso_timestamp"),
      ),
    ).to.equal(iso);

    const tx5 = await contracts.PublicResolver.connect(signer_1)["setAddress"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
    );
    await tx5.wait();

    expect(await contracts.PublicResolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld))).to.equal(signer_1.address);
  });

  it("Register Premium Domain and Set Address Record", async function () {
    const [master_signer, signer_1] = await ethers.getSigners();
    const { contracts } = await loadFixture(deployAndSetup);

    const host = `i-am-host-${luxon.DateTime.now().toSeconds().toFixed(0)}`;
    const name = `testing-${luxon.DateTime.now().toSeconds().toFixed(0)}-6`;
    const tld = "_ether";
    const expiry = luxon.DateTime.now().plus({ day: 1 }).toSeconds().toFixed(0);

    const _host_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(host));
    const _name_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name));
    const _tld_ = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(tld));

    if (!contracts.ClassicalRegistrarController) throw new Error("`ClassicalRegistrarController` missing");
    if (!contracts.Registry?.Diamond) throw new Error("`Registry` missing");
    if (!contracts.Mortgage) throw new Error("`Mortgage` missing");
    if (!contracts.Token) throw new Error("`Token` missing");
    if (!contracts.PublicResolver) throw new Error("`PublicResolver` missing");

    const Registry = IRegistry__factory.connect(contracts.Registry.Diamond.address, master_signer);

    const tx1 = await contracts.Mortgage.setRequirement(_name_, _tld_, 10000);
    await tx1.wait();
    expect(await contracts.Mortgage.getRequirement(_name_, _tld_)).to.equal(10000);

    const tx2 = await contracts.ClassicalRegistrarController["register(bytes,bytes,address,uint64)"](
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
      expiry,
    );
    await tx2.wait();

    expect(await Registry["isExists(bytes32,bytes32)"](_name_, _tld_)).to.equal(true);
    expect(await Registry["getOwner(bytes32,bytes32)"](_name_, _tld_), "Same Owner").to.equal(signer_1.address);
    expect(await Registry["getUser(bytes32,bytes32)"](_name_, _tld_), "Same User").to.equal(signer_1.address);
    expect(await Registry["getUserExpiry(bytes32,bytes32)"](_name_, _tld_), "Same User Expiry").to.equal(expiry);
    expect(await Registry["getExpiry(bytes32,bytes32)"](_name_, _tld_), "Same Expiry").to.equal(expiry);

    expect(await contracts.PublicResolver.getText(ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld))).to.equal("");

    expect(
      contracts.PublicResolver.connect(signer_1)["setAddress"](ethers.utils.toUtf8Bytes("@"), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld), signer_1.address),
    ).to.be.revertedWith("DOMAIN_MORTGAGE_NOT_FULFILLED");

    // Mint some token to signer_1
    const tx3 = await contracts.Token.mint(signer_1.address, ethers.utils.parseUnits("1000000"));
    await tx3.wait();

    expect(await contracts.Token.balanceOf(signer_1.address)).to.equal(ethers.utils.parseUnits("1000000"));

    const tx4 = await contracts.Token.connect(signer_1).approve(contracts.Mortgage.address, ethers.utils.parseUnits("10000"));
    await tx4.wait();

    // signer_1 do the deposit to `Mortgage`
    const tx5 = await contracts.Mortgage.connect(signer_1).deposit(_name_, _tld_, signer_1.address, ethers.utils.parseUnits("10000"));
    await tx5.wait();

    const tx6 = await contracts.PublicResolver.connect(signer_1)["setAddress"](
      ethers.utils.toUtf8Bytes(host),
      ethers.utils.toUtf8Bytes(name),
      ethers.utils.toUtf8Bytes(tld),
      signer_1.address,
    );
    await tx6.wait();

    expect(await contracts.PublicResolver.getAddress(ethers.utils.toUtf8Bytes(host), ethers.utils.toUtf8Bytes(name), ethers.utils.toUtf8Bytes(tld))).to.be.equal(signer_1.address);
  });
});

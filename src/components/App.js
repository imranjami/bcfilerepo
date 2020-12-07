import BCFileRepo from '../abis/BCFileRepo.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';

// Instantiate IPFS variable
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected.')
    }
  }

  async loadBlockchainData() {
    // Instantiate web3 variable
    const web3 = window.web3
    // Loads the account
    const accounts = await web3.eth.getAccounts()
    // Sets the account attribute of the state variable
    this.setState({account: accounts[0]})
    // Gets the Ethereum-based network ID
    const networkId = await web3.eth.net.getId()
    // Gets the network data using the network ID. This is found in the src/abis/BCFileRepo.json file
    const networkData = BCFileRepo.networks[networkId]
    // Check to see if the contract lives on the given network
    if(networkData) {
      // Create new contract via web3. web3.eth.Contract(<JSON-Interface>, <address>)
      const bcfrepo = new web3.eth.Contract(BCFileRepo.abi, networkData.address)
      // Sets the bcfrepo object attribute of the state variable
      this.setState({ bcfrepo })
      // Get files count
      const filesCount = await bcfrepo.methods.fileCount().call()
      // Sets the filesCount of the state variable
      this.setState({ filesCount })
      // Reverse load the files (to display most recent at the top in the UI)
      for (var i = filesCount; i >= 1; i--) {
        const file = await bcfrepo.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('BCFileRepo contract not deployed to detected network.')
    }
  }

  // Event to get file from user
  captureFile = (event) => {
    // Stops any default behavior so the page doesn't refresh and we can override
    event.preventDefault()
    // Gets the file from the form field
    const file = event.target.files[0]
    // Instantiate new FileReader object native to JavaScript
    const reader = new window.FileReader()
    if (file) {
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({
          buffer: Buffer(reader.result),
          type: file.type,
          name: file.name
        })
        console.log('buffer', this.state.buffer)
      }
    }
  }


  // Upload File
  uploadFile = (description) => {
    console.log("Submitting file to IPFS...")
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("IPFS result", result)
      // Error handling
      if (error) {
        console.log(error)
        return
      }

      this.setState({loading: true})
      // Sets the file type attribute of the state variable
      if (this.state.type === "") {
        this.setState({type: "none"})
      }
      // call upload file method from the smart contract loaded to the bcfrepo variable
      this.state.bcfrepo.methods.uploadFile(result[0].hash, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({
        loading: false,
        type: null,
        name: null
      })
      window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })
    })
  }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      bcfrepo: null,
      files: [],
      loading: false,
      type: null,
      name: null
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
            />
        }
      </div>
    );
  }
}

export default App;

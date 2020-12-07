pragma solidity ^0.5.0;

contract BCFileRepo {

  string public name = "BCFileRepo";
  uint public fileCount = 0;
  mapping(uint => File) public files;

  // Struct
  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }


  // Event
  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName,
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );

  constructor() public {

  }

  function uploadFile (string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    // makes sure the fileHash exists
    require(bytes(_fileHash).length > 0);
    // makes sure the fileType exists
    require(bytes(_fileType).length > 0);
    // makes sure the fileName exists
    require(bytes(_fileName).length > 0);
    // makes sure the fileDescription exists
    require(bytes(_fileDescription).length > 0);
    // make sure the address exists
    require(msg.sender != address(0));
    // make sure the fileSize is not zero
    require(_fileSize > 0);
    // increment the file count
    fileCount ++;
    // ex: File(1, 'abc123', 1024, 'foobar', 'Foo bar baz', 1231231, 0x0);
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }
}

const { TeleportSingleton } = require("../lib/index");


(function(){


    // Arrange
    const teleport = TeleportSingleton.getInstance();
    const eventNames = ['event1', 'event2', 'event3'];
    const expectedData = ['Data 1', 'Data 2', 'Data 3'];
    let receivedData = [];

    // Act
    setTimeout(() => {
        teleport.multiReceive(eventNames, (...data) => {
            receivedData = data;
            console.log(data);
        });  
    }, 1000);

    eventNames.forEach((eventName, index) => {
        teleport.emit(eventName, expectedData[index]);
    });

    
    console.log(expectedData, receivedData);
}())
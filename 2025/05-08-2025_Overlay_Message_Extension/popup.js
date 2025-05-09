document.getElementById('setMessage').addEventListener('click', () => 
  {
    const message = document.getElementById('message').value;
    const hour = parseInt(document.getElementById('hour').value);
    const minute = parseInt(document.getElementById('minute').value);
  
    if (message && !isNaN(hour) && !isNaN(minute)) 
      {
      console.log("Message:", message);
      console.log("Hour:", hour, "Minute:", minute);
  
      // Get the current time using JavaScript's Date object
      const currentDate = new Date();
  
      // Calculate the target time based on the user's input
      const targetDate = new Date(currentDate);
      targetDate.setHours(hour);
      targetDate.setMinutes(minute);
      targetDate.setSeconds(0);
  
      // If the target time is in the past today, set it for the next day
      if (targetDate < currentDate) 
      {
        targetDate.setDate(targetDate.getDate() + 1);
      }
  
      console.log("Target Time:", targetDate.toLocaleString());
      
      const timeDifference = targetDate - currentDate;
      console.log("Time Difference (in ms):", timeDifference);
  
      if (timeDifference > 0) 
        {
        // Get current overlays from storage
        chrome.storage.local.get("overlays", (data) => 
        {
          const overlays = data.overlays || [];
          
          // Add the new overlay to the list
          overlays.push(
          {
            message: message,
            targetTime: targetDate.toISOString(),
            timeDifference: timeDifference
          });
  
          // Save the updated overlays back to storage
          chrome.storage.local.set({ overlays }, () => 
          {
            console.log('New overlay added');
            alert('Message set!');
            // Refresh the page after setting the message
            chrome.tabs.reload();
          });
        });
      } 
      else 
      {
        alert('Please set a valid future time!');
      }
    } 
    else 
    {
      alert('Please fill in all fields correctly');
    }
  });
  
  // Function to update the queue display
  function updateOverlayQueue() {
    chrome.storage.local.get("overlays", (data) => {
      const overlays = data.overlays || [];
      const overlayListElement = document.getElementById('overlayQueue');
      
      overlayListElement.innerHTML = ''; // Clear the list
      
      overlays.forEach((overlay, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'overlay-item';
        
        const targetDate = new Date(overlay.targetTime);
        listItem.textContent = `${overlay.message} - ${targetDate.toLocaleString()}`;
        
        // Add a delete button for each overlay
        const deleteButton = document.createElement('span');
        deleteButton.className = 'delete-btn';
        deleteButton.textContent = ' (Delete)';
        deleteButton.addEventListener('click', () => {
          deleteOverlay(index);
        });
        
        listItem.appendChild(deleteButton);
        overlayListElement.appendChild(listItem);
      });
    });
  }
  
  // Function to delete an overlay
  function deleteOverlay(index) {
    chrome.storage.local.get("overlays", (data) => 
      {
      const overlays = data.overlays || [];
      
      // Remove the selected overlay
      overlays.splice(index, 1);
      
      // Save the updated overlays list
      chrome.storage.local.set({ overlays }, () => {
        console.log('Overlay deleted');
        updateOverlayQueue();
      });
    });
  }
  
  // Update the overlay queue when the popup opens
  updateOverlayQueue();
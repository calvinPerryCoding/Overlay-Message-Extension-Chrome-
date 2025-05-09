chrome.storage.local.get("overlays", (data) => 
  {
  const overlays = data.overlays || [];
  
  console.log("Loaded Overlays:", overlays);

  overlays.forEach((overlay) => 
    {
    const targetTime = new Date(overlay.targetTime); // Get the target time for this overlay
    const currentDate = new Date();
    const timeDifference = targetTime - currentDate; // Calculate the difference in milliseconds

    console.log("Target Time:", targetTime.toLocaleString());
    console.log("Time Difference:", timeDifference);

    // Ensure the overlay is not already shown and is in the future
    if (timeDifference > 0) 
      {
      console.log(`Setting timeout for overlay: ${overlay.message}`);
      
      // Set a timeout to show the overlay at the target time
      setTimeout(() => {
        console.log(`Displaying overlay: ${overlay.message}`);
        
        // Create the overlay div
        const overlayDiv = document.createElement('div');
        overlayDiv.textContent = overlay.message;
        overlayDiv.style.position = 'fixed';
        overlayDiv.style.top = '50%';
        overlayDiv.style.left = '50%';
        overlayDiv.style.transform = 'translate(-50%, -50%)';
        overlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlayDiv.style.color = 'white';
        overlayDiv.style.padding = '100px';
        overlayDiv.style.fontSize = '100px';
        overlayDiv.style.borderRadius = '10px';
        overlayDiv.style.zIndex = '9999';

        // Create the close button (X)
        const closeButton = document.createElement('div');
        closeButton.textContent = '×';  // Unicode "X" character
        closeButton.style.position = 'absolute';
        closeButton.style.top = '5px';
        closeButton.style.right = '5px';
        closeButton.style.fontSize = '30px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.color = 'red';
        closeButton.style.fontWeight = 'bold';
        
        // Add click event to close the overlay
        closeButton.addEventListener('click', () => 
        {
          overlayDiv.remove();
        });
        
        // Append the close button to the overlay
        overlayDiv.appendChild(closeButton);
        
        // Append the overlay to the document body
        document.body.appendChild(overlayDiv);

        // Optional: Remove the overlay from the queue once it's displayed
        chrome.storage.local.get("overlays", (data) => 
        {
          const updatedOverlays = data.overlays.filter((item) => item.targetTime !== overlay.targetTime);
          chrome.storage.local.set({ overlays: updatedOverlays });
        });

      }, timeDifference);
    }
  });
});
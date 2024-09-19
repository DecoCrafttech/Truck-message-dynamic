import React, { useEffect } from 'react';

const FuelPrice = () => {
  useEffect(() => {
    // Dynamically add the script to the DOM
    const script = document.createElement('script');
    script.src = 'https://www.mypetrolprice.com/Embed/script/EmbedJS.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id='mypp_embd' className=' container  align-self-center  ' data-url='https://www.mypetrolprice.com/Embed/EmbedResponse.aspx'></div>
  );
};

export default FuelPrice;

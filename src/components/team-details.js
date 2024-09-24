import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';



function TeamDetails() {
  const [distance, setDistance] = useState('');
  const [fuel, setFuel] = useState('');
  const [price, setPrice] = useState('');
  const [result, setResult] = useState({
    distance: '',
    fuel: '',
    totalAmount: '',
    fuelExpense: '',
    mileage: ''
  });

  const calculateMileage = () => {
    const parsedDistance = parseFloat(distance);
    const parsedFuel = parseFloat(fuel);
    const parsedPrice = parseFloat(price);

    if (isNaN(parsedDistance) || isNaN(parsedFuel) || isNaN(parsedPrice)) {
      toast.error('Please enter valid numbers');
      return;
    }

    if (parsedFuel === 0) {
      toast.error('Fuel amount cannot be zero. Please enter a valid fuel amount.');
      return;
    }

    const totalAmount = parsedPrice * parsedFuel;
    const fuelExpense = totalAmount / parsedDistance;
    const mileage = parsedDistance / parsedFuel;

    setResult({
      distance: `${distance} Km`,
      fuel: `${fuel} Liters`,
      totalAmount: `${totalAmount} INR`,
      fuelExpense: `${fuelExpense.toFixed(2)} INR/Km`,
      mileage: `${mileage.toFixed(2)} Km/Liters`
    });
  };

  const resetForm = () => {
    setDistance('');
    setFuel('');
    setPrice('');
    setResult({
      distance: '',
      fuel: '',
      totalAmount: '',
      fuelExpense: '',
      mileage: ''
    });
  };

  return (
    <div className="container  ">
      <div className='row'>
        <h2 className='textheadermil'>Mileage Calculator</h2>
        <div className='boxxing row align-items-center'>


          <div className='col-md-6'>
            <form>
              <div>
                <label htmlFor="distance mb-0">Distance:</label>
                <input
                  type="number"
                  className="px-2 mb-0 input-height-reset"
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Enter distance in Km"
                />
              </div>
              <div>
                <label htmlFor="fuel">Fuel:</label>
                <input
                  type="number"
                  className="px-2 mb-0 input-height-reset"
                  id="fuel"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  placeholder="Enter fuel in Liters"
                />
              </div>
              <div>
                <label htmlFor="price">Price:</label>
                <input
                  type="number"
                  className="px-2 mb-0 input-height-reset"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price in INR"
                />
              </div>
              <div className="col-lg-12 d-flex flex-wrap  mt-4">
               

                <div className='col'>
                  <button type="button" className="btn btn-transparent border shadow-none border-3  py-1 col-lg-6 btn-md w-100" onClick={resetForm}>
                    Reset
                  </button>
                </div>
                <div className='col'>
                  <button type="button" className="btn mileage col-lg-6 py-1 btn-md w-100" onClick={calculateMileage}>
                    Calculate
                  </button>
                </div>

              </div>

            </form>
          </div>

          <div className='col-md-6'>

            {/* <div className=" container ">
              <h4>Result</h4>
              <p>Distance: <span>{result.distance}</span></p>
              <p>Fuel: <span>{result.fuel}</span></p>
              <p>Total Amount: <span>{result.totalAmount}</span></p>
              <p>Fuel Expense: <span>{result.fuelExpense}</span></p>
              <p>Mileage: <span>{result.mileage}</span></p>
            </div> */}

            <table class="table table-bordered">
              <tbody>
                <tr className='w-100'>
                  <th scope="row" className='w-50'>Distance:</th>
                  <td className='w-50'>{result.distance}</td>
                </tr>
                <tr className='w-100'>
                  <th scope="row" className='w-50'>Fuel:</th>
                  <td className='w-50'>{result.fuel}</td>
                </tr>
                <tr className='w-100'>
                  <th scope="row" className='w-50'>Total Amount:</th>
                  <td className='w-50'>{result.totalAmount}</td>
                </tr>
                <tr className='w-100'>
                  <th scope="row" className='w-50'>Fuel Expense:</th>
                  <td className='w-50'>{result.fuelExpense}</td>
                </tr>
                <tr className='text-center'>
                  <th scope="row" colspan="2">
                    <span>Mileage :</span>
                    <p className='mb-0'>{result.mileage}</p>
                  </th>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

      </div>
 
    </div>
  );
}

export default TeamDetails;

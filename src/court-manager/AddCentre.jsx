import React, { useEffect, useState } from "react";
import { imageDb } from '../uploadimagefirebase/Config';
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { v4 } from "uuid";
import InputText from '../components/InputText';
import Dialog from '../components/Dialog';
import Dropdown from '../components/Dropdown';
import arrow from '../assets/images/arrow.svg';
import moment from "moment";
import axiosInstance from "../config/axiosConfig";
import { toast } from "react-toastify";

function AddCentre(props) {

  // CLOSE ADD CENTRE DIALOG
  const handleClose = () => {
    props.setIsOpen();
  }

  const items = generate24Hours();
  function generate24Hours() {
    let hours = [];
    for (let i = 0; i < 24; i++) {
      let hour = i < 10 ? `0${i}:00` : `${i}:00`;
      hours.push(hour);
    }
    return hours;
  }

  const [centreForm, setCentreForm] = useState({
    name: '',
    address: '',
    openTime: '',
    closeTime: '',
    pricePerHour: '',
    numberOfCourt: '',
    paymentMethod: '',
    approveDate: moment().format('yyyy-MM-DD'),
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCentreForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectOpenTime = (item) => {
    setCentreForm(prevState => ({
      ...prevState,
      openTime: item
    }));
  };

  const handleSelectCloseTime = (item) => {
    setCentreForm(prevState => ({
      ...prevState,
      closeTime: item
    }));
  };

  // const handleImageChange = (e, index) => {
  //   const { value } = e.target;
  //   setCentreForm(prevState => {
  //     const newImages = [...prevState.images];
  //     newImages[index] = value;
  //     return {
  //       ...prevState,
  //       images: newImages
  //     };
  //   });
  // };

  // Handle image upload
  const [imgUrls, setImgUrls] = useState([]);

  const handleImageUpload = (selectedImg) => {
    if (selectedImg !== null) {
      const imgRef = ref(imageDb, `files/${v4()}`);
      uploadBytes(imgRef, selectedImg).then(value => {
        getDownloadURL(value.ref).then(url => {
          setImgUrls(prevUrls => [...prevUrls, { url, ref: value.ref }]);
        });
      });
    }
  };

  const handleDeleteImage = (imgRef, url) => {
    deleteObject(imgRef).then(() => {
      setImgUrls(prevUrls => prevUrls.filter(img => img.url !== url));
      setCentreForm(prevState => ({
        ...prevState,
        images: prevState.images.filter(image => image !== url)
      }));
    }).catch(error => {
      console.error("Error deleting image: ", error);
    });
  };

  useEffect(() => {
    setCentreForm(prevState => ({
      ...prevState,
      images: imgUrls.map(img => img.url)
    }));
  }, [imgUrls]); // This effect runs whenever imgUrls changes

  // Scroll handlers
  const scrollLeft = () => {
    document.getElementById('image-scroll-container').scrollLeft -= 100;
  };

  const scrollRight = () => {
    document.getElementById('image-scroll-container').scrollLeft += 100;
  };

  const handleImageChange = (e) => {
    const selectedImg = e.target.files[0];
    handleImageUpload(selectedImg);
  };

  const submit = async () => {
    console.log(centreForm);

    await axiosInstance.post(`/courtstar/manager/create`, centreForm)
      .then(res => {
        console.log(res.data);
        toast.success("Create Successfully!", {
          toastId: 'add-centre-success'
        });
      })
      .catch(error => {
        console.log(error.message);
        toast.error(error.message, {
          toastId: 'add-centre-error'
        });
      })
      .finally();
  }


  //clear form
  const clearForm = () => {

    setCentreForm({
      name: '',
      address: '',
      openTime: '',
      closeTime: '',
      pricePerHour: '',
      numberOfCourt: '',
      paymentMethod: '',
      approveDate: moment().format('yyyy-MM-DD'),
      images: []
    })
  }

  const html = (
    <div>
      <div>
        {imgUrls.length > 0 && (
          <img src={imgUrls[0].url} alt="Centre" className='h-64 w-fit mx-auto rounded-xl' />
        )}
      </div>
      <div className='flex gap-2 my-2 pt-1.5 border rounded-md bg-white overflow-hidden mx-auto relative'>
        {/* <button onClick={scrollLeft} className="absolute top-0 left-0 h-full opacity-30 bg-slate-100 w-8 transition-all ease-in-out duration-300 hover:bg-gray-500">
          <img src={arrow} alt="Scroll left" className='my-auto mx-auto' />
        </button> */}
        <div
          id='image-scroll-container'
          className='flex gap-2 overflow-x-auto pb-1.5 px-2'
        >
          <div
            className='flex justify-center items-center border rounded-lg cursor-pointer h-16 min-w-24 px-7'
            onClick={() => document.getElementById('image-upload-input').click()}
          >
            <span className='text-4xl font-bold'>+</span>
          </div>
          <input
            id='image-upload-input'
            type="file"
            onChange={handleImageChange}
            className='hidden'
          />
          {imgUrls.map((img, index) => (
            <div key={index} className="image-container relative">
              <img
                src={img.url}
                alt={`Court ${index + 1}`}
                className='min-w-24 max-w-24 h-16 rounded-lg object-cover object-center '
              />
              <svg
                onClick={() => handleDeleteImage(img.ref, img.url)}
                xmlns="http://www.w3.org/2000/svg"
                width="20" height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor" s
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-circle-x absolute right-1 top-1 bg-white rounded-full cursor-pointer hover:scale-110 ease-in-out duration-200">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          ))}
        </div>
        {/* <button onClick={scrollRight} className="absolute top-0  right-0 h-full opacity-30 bg-slate-100 w-8 transition-all ease-in-out duration-300 hover:bg-gray-500">
          <img src={arrow} alt="Scroll right" className='my-auto mx-auto rotate-180' />
        </button> */}
      </div>
      <div className='mx-auto'>
        <div className='mb-4'>
          <InputText
            id="name"
            name="name"
            placeholder="Enter name of centre"
            label="Centre Name"
            value={centreForm.name}
            onchange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <InputText
            id="address"
            name="address"
            placeholder="Enter address of centre"
            label="Centre Address"
            value={centreForm.address}
            onchange={handleChange}
          />
        </div>
        <div className='mb-4'>
          <InputText
            id="numberOfCourt"
            name="numberOfCourt"
            placeholder="Enter number of courts"
            label="Number of courts"
            value={centreForm.numberOfCourt}
            onchange={handleChange}
          />
        </div>
        <div className='mb-3'>
          <InputText
            id="pricePerHour"
            name="pricePerHour"
            placeholder="Enter price per hour"
            label="Price per hour"
            value={centreForm.pricePerHour}
            onchange={handleChange}
          />
        </div>
      </div>
      <div className="flex gap-4">
        <div className='basis-1/2'>
          <div className='w-full flex flex-col gap-2 text-gray-800 font-semibold mb-2'>
            Open Time:
          </div>
          <div className='flex gap-4 items-center'>
            <Dropdown
              placeholder="Select open time"
              items={items}
              onSelect={handleSelectOpenTime}
              dir='up'
            />
          </div>
        </div>
        <div className='basis-1/2'>
          <div className='w-full flex flex-col gap-2 text-gray-800 font-semibold mb-2'>
            Close time:
          </div>
          <div className='flex gap-4 items-center'>
            <Dropdown
              placeholder="Select close time"
              items={items}
              onSelect={handleSelectCloseTime}
              dir='up'
            />
          </div>
        </div>
      </div>
      <div className="bg-white mt-4 mx-auto">
        <div className='mb-4'>
          <InputText
            id="paymentMethod"
            name="paymentMethod"
            placeholder="Enter payment method"
            label="Payment method"
            value={centreForm.paymentMethod}
            onchange={handleChange}
          />
        </div>
      </div>
      {/* <div className="bg-white mt-4 mx-auto">
        <h2 className="text-3xl font-semibold mb-3 text-center">PAYMENT METHOD</h2>
      </div>
      <div>
        <div>
          <img src={paypal}
            alt="Paypal"
            className='h-auto mx-auto w-7/12 mb-3'
          />
        </div>
        <div className='mb-4'>
          <InputText
            id="managerName"
            name="managerName"
            placeholder="Enter name of Manager"
            label="Manager Name"
          />
        </div>
        <div className=''>
          <InputText
            id="accountNumber"
            name="accountNumber"
            placeholder="Enter account number of Manager's Paypal Account"
            label="Account number"
          />
        </div>
      </div> */}
    </div >
  );

  return (
    <div>
      <Dialog
        html={html}
        isOpen={props.isOpen}
        submit={submit}
        setIsOpen={handleClose}
        title='Centre Information'
        clearForm={clearForm}
      />
    </div>
  );
}

export default AddCentre;

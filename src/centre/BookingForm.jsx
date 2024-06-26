import React, { useEffect, useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import InputText from '../components/input-text';
import PopupModal from '../components/PopupModal';
import Button from '../components/button';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const BookingForm = (props) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const controller = new AbortController();
  const { signal } = controller;
  const { state } = useAuth();
  const { account } = state;

  //CLOSE BOOKING MODAL
  const handleClose = () => {
    props.setIsOpen();
  }

  const [bookingForm, setBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookingForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (account)
      setBookingForm((prevForm) => ({
        ...prevForm,
        fullName: (account.firstName + " " + account.lastName).trim(),
        email: account.email,
        phone: account.phone,
      }));
  }, [account]);

  useEffect(() => {
    setBookingForm((prevForm) => ({
      ...prevForm,
      ...props.formCalendar,
    }));
  }, [props.formCalendar]);

  const booking = async () => {
    setLoading(true);
    await axiosInstance.post(`/courtstar/booking`, bookingForm)
      .then(res => {
        window.location.href = res.data.data.order_url;
      })
      .catch(error => {
        console.log(error.message);
      })
      .finally(() => {
        setLoading(false);
        handleClose();
      });
  }

  useEffect(() => {
    console.log(bookingForm);
  }, [bookingForm]);

  const html = (
    <div className='font-medium w-[440px] items-center flex flex-col gap-3'>
      <InputText
        id="fullName"
        name="fullName"
        label={`${t('fullName')}*`}
        placeholder='Enter full name'
        value={bookingForm.fullName || ""}
        onchange={handleChange}
        disabled={account?.firstName}
      />
      <InputText
        id="phone"
        name="phone"
        label={`${t('phone')}*`}
        placeholder='Enter phone number'
        value={bookingForm.phone || ""}
        onchange={handleChange}
        disabled={account?.phone}
      />
      <InputText
        id="email"
        name="email"
        label="Email*"
        placeholder='Enter your email'
        value={bookingForm.email || ""}
        onchange={handleChange}
        disabled={account?.email}
      />
      <div className='py-3 flex justify-center items-center gap-1 font-semibold'>
        {t('price')}:
        <span className='text-rose-600'> {props?.centre?.pricePerHour?.toLocaleString('de-DE')} VND/h</span>
      </div>
      <div className='flex items-center justify-center w-full'>
        <Button
          label={t('confirm')}
          fullWidth
          fullRounded
          size='medium'
          className='bg-primary-green hover:bg-teal-900 text-white'
          loading={loading}
          onClick={booking}
        />
      </div>
    </div>
  )
  return (
    <div>
      <PopupModal
        html={html}
        isOpen={props.isOpen}
        setIsOpen={handleClose}
        centreInfo
        title={t('booking')}
      />
    </div>
  )

}

export default BookingForm;

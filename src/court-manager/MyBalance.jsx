import React, { useEffect, useState } from 'react'
import Counter from '../components/Counter';
import Button from '../components/button';
import PopupModal from '../components/PopupModal';
import { useTranslation } from 'react-i18next';
import InputText from '../components/input-text';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';

export default function MyBalance(props) {

  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const balanceDetail = props.balanceDetail;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axiosInstance.post(`/courtstar/payment/donate-admin`, {amount: amount})
      .then(res => {
        window.location.href = res.data.order_url;
      })
      .catch(error => {
        toast.error(error.message, {
          toastId: 'topup-error'
        });
      })
      .finally(
        () => {
          setLoading(false);
          setIsOpen(false);
        }
      );
  };

  return (
    <div className='w-full bg-white my-6 rounded-lg'>
      <div className='w-full h-[20rem] rounded-t-lg bg-gradient-to-r from-emerald-50 to-[#408576] bg-opacity-40 relative
      flex justify-between px-28'>
        <div className='w-full flex flex-col gap-10 justify-center'>
          <div>
            <div className='text-2xl font-semibold mb-2'>{t('myBalance')}</div>
            <div className='text-5xl flex gap-2 font-bold'>
              <Counter
                endNumber={balanceDetail?.currentBalance}
                duration={1000}
              />
              <span className='text-base'>VND</span>
            </div>
          </div>
          <div className='flex gap-10'>
            <div className='py-3 px-5 w-48 shadow-md rounded-lg bg-white font-semibold'>
              <div className='flex justify-between items-center'>
                <div>{t('income')}</div>
                <div className='text-xs text-teal-600'>
                  <Counter
                    endNumber={20}
                    duration={1000}
                    postfix='%'
                    prefix='+'
                  />
                </div>
              </div>
              <div className='text-lg flex gap-0.5 font-bold'>
                <Counter
                  endNumber={800000}
                  duration={1000}
                />
                <span className='text-[7px]'>VND</span>
              </div>
            </div>
            <div className='py-3 px-5 w-48 shadow-md rounded-lg bg-white font-semibold'>
              {t('totalRevenue')}
              <div className='text-lg flex gap-0.5 font-bold'>
                <Counter
                  endNumber={1800000}
                  duration={1000}
                />
                <span className='text-[7px]'>VND</span>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full p-10 flex flex-col gap-5 justify-center items-end'>
          <Button
            label={t('topUp')}
            size='large'
            className='bg-slate-200 hover:bg-slate-300 font-semibold text-primary-green w-52'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-landmark"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>
            }
            onClick={() => setIsOpen(true)}
          />
          <Button
            label={t('withdraw')}
            size='large'
            className='bg-slate-200 hover:bg-slate-300 font-semibold text-primary-green w-52'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17"/><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 16 6 6"/><circle cx="16" cy="9" r="2.9"/><circle cx="6" cy="5" r="3"/></svg>
            }
          />
          <Button
            label={t('billPayment')}
            size='large'
            className='bg-slate-200 hover:bg-slate-300 font-semibold text-primary-green w-52'
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
            }
          />
        </div>
      </div>

      <PopupModal
        isOpen={isOpen}
        setIsOpen={() => setIsOpen(false)}
        html={
          <div className="w-[440px]">
            <h2 className="text-4xl font-semibold mb-5 text-center">{t('topUp')}</h2>
            <form onSubmit={submit}>
              <div className="mb-4">
                <InputText
                  id="amount"
                  name="amount"
                  type='number'
                  placeholder={t('enterAmount')}
                  label={t('amount')}
                  value={amount}
                  onchange={(e) => {setAmount(e.target.value)}}
                />
              </div>

              <div className='flex items-center justify-center'>
                <Button
                  type='submit'
                  label={t('confirm')}
                  fullWidth
                  fullRounded
                  size='medium'
                  className='bg-primary-green hover:bg-teal-900 text-white'
                  loading={loading}
                />
              </div>
            </form>
          </div>
        }
      />
    </div>
  )
}

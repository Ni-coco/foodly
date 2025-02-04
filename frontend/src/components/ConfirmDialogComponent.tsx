import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion } from 'framer-motion';
import React from 'react';

/**
 * Composant de dialog de confirmation.
 * 
 * @param {boolean} open - Indique si le dialog est ouvert ou non.
 * @param {() => void} onClose - Fonction de rappel appelée lorsque le dialog est fermé.
 * @param {string} [title] - Titre du dialog. Si non fourni, aucun titre ne sera affiché.
 * @param {string} [message] - Message affiché dans le dialog.
 * @param {string} [cancel] - Texte du bouton d'annulation.
 * @param {string} [confirm] - Texte du bouton de confirmation.
 * @param {() => void} [onValidation] - Fonction de rappel appelée lorsque le bouton de confirmation est cliqué.
 */
export default function ConfirmDialogComponent({
  open,
  onClose,
  title,
  message,
  cancel,
  confirm,
  onValidation
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  cancel?: string;
  confirm?: string;
  onValidation?: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-10">
      {/* Fond d'écran du dialog */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-hidden hide-scrollbar">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          {/* Contenu du panneau de dialog */}
          <DialogPanel
            transition
            className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 max-h-[400px]">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  {/* Affichage du titre du modal */}
                  {title && (
                    <DialogTitle
                      as="h3"
                      className="text-lg text-center font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </DialogTitle>
                  )}
                </div>
              </div>
              <div className='flex mt-4'>
                <label className='text-gray-900 text-sm'>{message}</label>
              </div>
            </div>
            {/* Boutons d'action en bas du modal */}
            <div className="bg-gray-50 flex px-4 py-3 justify-end gap-2">
              {/* Bouton d'annulation */}
              <motion.button
                type="button"
                data-autofocus
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                {cancel}
              </motion.button>
              {/* Bouton de confirmation */}
              <motion.button
                type="button"
                onClick={onValidation}
                whileTap={{ scale: 0.9 }}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm"
              >
                {confirm}
              </motion.button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

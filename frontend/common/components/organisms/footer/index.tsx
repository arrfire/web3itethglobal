'use client'
import {
  useRef, useState,
} from "react";
import lang from "@/common/lang";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTriggerFooter as ModalTrigger,
} from "@/common/components/organisms";
import { routes } from "@/common/routes";
import {
  Button,
  LinkStyled,
} from "../../atoms";
import {
  LinkedInIcon,
  TwitterIcon,
  TelegramMainIcon,
} from "../../icons";

const {
  footer: footerCopy,
} = lang

export const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const handleContact = () => {
    if (textAreaRef?.current?.value) {
      window.open("mailto:support@web3it.ai?" + "body=" + textAreaRef.current.value, "_blank");
      setIsModalOpen(false);
      textAreaRef.current.value = "";
    }
  }
  return (
    <>
      <footer className="relative border-t border-gray-200/5">
        <div className="bottom-0 left-0 opacity-15 absolute w-full blur-xl h-[300px] bg-gradient-to-b from-transparent to-white pointer-events-none -z-10"></div>
        <div className="px-4">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-4 py-4 md:py-12 md:gap-2 pb-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://www.linkedin.com/company/dreamstarterxyz/" target="_blank" className="group buttonWithGradient">
                  <LinkedInIcon className="text-white" width={32} height={32}  />
                </a>
                <a href="https://x.com/DreamStarterXYZ" target="_blank" className="group buttonWithGradient">
                  <TwitterIcon width={32} height={32} className="text-white" />
                </a>
                <a href="https://t.me/dreamstarterxyz" className="group buttonWithGradient">
                  <TelegramMainIcon width={32} height={32} className="text-white" />
                </a>
              </div>
              <div className="flex gap-8">
                <LinkStyled href={routes.aboutPath} className="!px-0">{footerCopy.aboutUs}</LinkStyled>
                <LinkStyled href={routes.termsPath} className="!px-0">{footerCopy.terms}</LinkStyled>
                <LinkStyled href={routes.privacyPath} className="!px-0">{footerCopy.privacyPolicy}</LinkStyled>
              </div>
            </div>
            <Modal>
              <ModalTrigger setIsModalOpen={setIsModalOpen}>
                {footerCopy.contactUs}
              </ModalTrigger>
              <ModalBody isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} className="md:!max-w-[450px]">
                <ModalContent>
                  <h4 className="text-white font-semibold text-xl md:text-2xl ml-6 pt-4">{footerCopy.contactUsModal.heading}</h4>
                  <form className="px-6 mt-6">
                    <textarea
                      ref={textAreaRef}
                      placeholder="Message"
                      required
                      className="w-full mb-4 p-2 px-4 bg-white ring-0 border-0 outline-none h-32 rounded-2xl text-black"
                    ></textarea>
                    <Button size="sm" type="submit" onClick={handleContact} variant="primary" className="transition-all duration-150 w-full hover:from-han-purple/70
                    hover:to-tulip/70 bg-gradient-to-tr from-han-purple to-tulip font-medium">
                      {footerCopy.contactUsModal.submitButton}
                    </Button>
                  </form>
                  <p className="mt-4 text-gray-300 text-center mb-6 px-6">
                    {footerCopy.contactUsModal.youCanContact} <span className="font-semibold">support@web3it.ai</span>
                  </p>
                </ModalContent>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </footer>
    </>
  );
};

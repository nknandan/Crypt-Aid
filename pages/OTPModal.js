import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Stack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

const OTPModal = ({ isOpen, onClose, onVerify }) => {
  const [otp, setOTP] = useState("");

  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const handleSubmit = () => {
    onVerify(otp);
  };

  const onCLoseWrapper = () => {
    setOTP("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onCLoseWrapper} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Enter OTP</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <FormControl>
              <FormLabel>Enter the 6-digit OTP</FormLabel>
              <Input type="tel" pattern="[0-9]{6}" placeholder="Enter OTP" value={otp} onChange={handleOTPChange} />
            </FormControl>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Verify
          </Button>
          <Button onClick={onCLoseWrapper}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OTPModal;

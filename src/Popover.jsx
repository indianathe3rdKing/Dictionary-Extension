import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  Input,
  Text,
} from "@chakra-ui/react";

const MyPopover = () => (
  <Popover>
    <PopoverTrigger>
      <Button size="sm" variant="outline">
        Click me
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverHeader fontWeight="medium">Naruto Form</PopoverHeader>
      <PopoverBody>
        <Text my="4">
          Naruto is a Japanese manga series written and illustrated by Masashi
          Kishimoto.
        </Text>
        <Input placeholder="Your fav. character" size="sm" />
      </PopoverBody>
    </PopoverContent>
  </Popover>
);

export default MyPopover;

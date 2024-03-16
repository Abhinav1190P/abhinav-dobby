import { useEffect, useState, useCallback } from "react";
import {
  Heading, Container, Text, Box, Input, Button, SimpleGrid, Image, InputRightElement, InputGroup, IconButton, Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormErrorMessage,
  useDisclosure,
  useToast,
  ModalCloseButton,
  useColorMode,
  HStack,
  Flex,
  Skeleton,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Controller, useForm } from "react-hook-form";
import { AddIcon } from "@chakra-ui/icons";
import { catchError } from "../../utils/catchError";
import { useDropzone } from 'react-dropzone';
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroll-component';


const schema = z.object({
  name: z
    .string()
    .trim()
    .min(5, "Name should be minimum 5 characters")
    .max(20, "Name can be maximum 20 characters"),
  image: z
    .string()
    .trim()
    .refine(value => value.trim() !== '', {
      message: "Image is required",
      path: ['image']
    })
})

const defaultValues = {
  name: "",
  image: "",
};

const Profile = () => {
  const api = useAxiosPrivate();
  const [info, setInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cloudinaryAsset = process.env.REACT_APP_CLOUDINARY_ASSET;
  const cloudinaryCloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const [selectedFile, setSelectedFile] = useState({})
  const [imagePreview, setimagePreview] = useState('')
  const [page, setPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const LIMIT = 3;
  const [totalPosts, setTotalPosts] = useState(0);
  const [items, setItems] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode()

  const toast = useToast()


  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    api.get("/api/user/profile")
      .then(({ data }) => {
        setInfo(data);
      })
      .catch((error) => {
        setInfo(null);
        console.error(error);
      });
  }, [api]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if (info && info.images) {
      const filtered = info.images.filter(image => image.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredImages(filtered);
    }
  }, [searchQuery, info]);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {

        const imageUrl = URL.createObjectURL(acceptedFiles[0]);
        setimagePreview(imageUrl);
        setSelectedFile(acceptedFiles[0])
        setValue('image', imageUrl)
      }
    }
  });

  const uploadImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("upload_preset", cloudinaryAsset);

      const { data: cloudinaryData } = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/upload`,
        formData
      );

      return cloudinaryData.secure_url;
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      throw error;
    }
  };

  const onSubmit = async (imageData) => {
    try {
      setLoading(true);
      const image_url = await uploadImage();
      setValue(image_url);

      const response = await api.post('/api/user/create-image', {
        imageUrl: image_url,
        name: imageData.name
      });

      if (response.data.success) {
        toast({
          title: "Image uploaded successfully",
          status: 'success',
          duration: 9000,
          position: 'top',
          isClosable: true,
        });
        reset()
        onClose()
        setimagePreview('')
        setSelectedFile({})
        const savedImage = response.data.savedImage;
        setItems(prevItems => [...prevItems, savedImage])
      } else {
        toast({
          title: "Failed to upload image",
          description: response.data.message,
          status: 'error',
          duration: 9000,
          position: 'top',
          isClosable: true,
        });
      }
    } catch (error) {
      setError(catchError(error));
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = () => {
  };




  useEffect(() => {
    const fetchPosts = async () => {
      try {
        await api.get(`/api/user/get-images/${page}/${LIMIT}`)
          .then(({ data }) => {

            setTotalPosts(data.total);
            setItems(data?.images);
          })
          .catch((error) => {
            setInfo(null);
            console.error(error);
          });

      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info]);

  const fetchMoreData = useCallback(() => {
    try {
      api.get(`/api/user/get-images/${activePage + 1}/${LIMIT}`)
        .then(({ data }) => {
          setActivePage(activePage => activePage + 1); // Functional update to avoid dependency warning
          setItems(prevItems => [...prevItems, ...data.images]);
          setPage(prevPage => prevPage + 1); // Functional update to avoid dependency warning
        })
        .catch((error) => {
          setInfo(null);
          console.error(error);
        });

    } catch (error) {
      console.error("Error fetching chats:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, info]);


  return (
    <Container>
      {info ? (
        <>
          <Box bg={colorMode === 'dark' ? '#1A202C' : 'white'} position="sticky" top="0" zIndex="sticky" p="4" mb="4">
            <Heading as="h1" mb="4">Welcome, {info.name}</Heading>
            <Box mb="4">
              <InputGroup>
                <Input
                  mb={4}
                  placeholder="Search by image name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <InputRightElement>
                  <IconButton onClick={onOpen} colorScheme="blue">
                    <AddIcon />
                  </IconButton>
                </InputRightElement>
              </InputGroup>
            </Box>
          </Box>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add your Image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {
                  loading ? (
                    <Flex pb={10} w="100%" h="100%" alignItems={'center'} justifyContent={'center'}>
                      <Spinner />
                    </Flex>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <FormControl pb={5} isInvalid={errors.name}>
                            <InputGroup>
                              <Input {...field} placeholder="Name" />
                            </InputGroup>
                            <FormErrorMessage mt={1} fontSize="x-small">{errors?.name?.message}</FormErrorMessage>
                          </FormControl>
                        )}
                      />

                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {acceptedFiles.length > 0 ? (
                          <Image src={imagePreview} alt="Preview" style={{ width: "100%", height: "auto" }} />
                        ) : (
                          <Box mb={5} border={'1px'} borderColor={'gray.100'} borderStyle={'dashed'} borderRadius={10} p={10}>
                            <Text>Drag 'n' drop an image here, or click to select an image</Text>
                          </Box>
                        )}
                      </div>
                      {errors.image && <span>{errors.image.message}</span>}
                      <HStack mt={4} pb={5} w="100%" alignItems={'flex-end'} justifyContent={'flex-end'}>
                        <Button variant={'ghost'} mr={3} onClick={onClose}>
                          Close
                        </Button>
                        <Button type="submit" colorScheme="blue">Submit</Button>
                      </HStack>
                    </form>
                  )
                }
              </ModalBody>
            </ModalContent>
          </Modal>
          <SimpleGrid columns={3} spacing={4}>
            {filteredImages.map((image, index) => (
              <Box key={index} borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Image src={image.url} alt={image.name} />
                <Text>{image.name}</Text>
              </Box>
            ))}
          </SimpleGrid>

          {
            items.length > 0 ? (

              <InfiniteScroll
                dataLength={totalPosts}
                next={fetchMoreData}
                hasMore={items.length < totalPosts}
                loader={<Flex w="400px" justifyContent={'center'} alignItems={'center'}><Text>Loading...</Text></Flex>}
                endMessage={<Flex mt={5} pb={10} w="100%" justifyContent={'center'} alignItems={'center'}><Text>No more items to load</Text></Flex>}
              >
                {items && items.length > 0 && (
                  <>
                    <Heading as="h2" mt="8" mb="4">Your Images</Heading>
                    {items
                      .filter((image) => image.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((image, index) => (
                        <Box mb={5} key={index} borderWidth="1px" borderRadius="lg" overflow="hidden">
                          {image.isLoading ? (
                            <Skeleton height="200px" width="100%" />
                          ) : (
                            <Image
                              src={image.image_url}
                              alt={image.name}
                              onLoad={() => {
                                const updatedItems = [...items];
                                updatedItems[index].isLoading = false;
                                setItems(updatedItems);
                              }}
                            />
                          )}
                          <Text>{image.name}</Text>
                        </Box>
                      ))}
                  </>
                )}
              </InfiniteScroll>
            ) : (
              <Flex w="100%" alignItems={'center'} justifyContent={'center'}>
                Start uploading images!
              </Flex>
            )
          }

        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </Container>

  );
};

export default Profile;

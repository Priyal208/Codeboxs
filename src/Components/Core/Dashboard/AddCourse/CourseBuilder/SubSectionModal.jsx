import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  view = false, 
  edit = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);  // Move selectedFile state here
  const { token } = useSelector((state) => state.auth);
  const { course } = useSelector((state) => state.course);
const [previewSource, setPreviewSource] = useState(""); // Add this line
  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
    }
  }, [view, edit, modalData, setValue]);
  useEffect(() => {
    console.log("Course content in CourseBuilder:", course.courseContent);
  }, [course.courseContent]);
  
  const isFormUpdated = () => {
    const currentValues = getValues();
    return (
      currentValues.lectureTitle !== modalData.title ||
      currentValues.lectureDesc !== modalData.description ||
      (currentValues.lectureVideo && currentValues.lectureVideo[0] !== modalData.videoUrl)
    );
  };

  useEffect(() => {
    console.log("NestedView received course content:", course.courseContent);
  }, [course.courseContent]);
  const [renderTrigger, setRenderTrigger] = useState(false);

  useEffect(() => {
    setRenderTrigger(!renderTrigger);
  }, [course.courseContent]);
    

  const handleEditSubsection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (selectedFile) {  // Use selectedFile directly here
      formData.append("video", selectedFile);
    }
    setLoading(true);
    try {
      const result = await updateSubSection(formData, token);    
      if (result) {  
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData.sectionId ? result : section
        );
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
      }
      setModalData(null);
    } catch (error) {
      console.error("Error updating subsection:", error);
      toast.error("Failed to update subsection");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (view) return;
  
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    if (selectedFile) {
      formData.append("video", selectedFile);
    }
  
    setLoading(true);
    try {
      const result = await createSubSection(formData, token);
      console.log("CREATE SUB-SECTION API RESPONSE:", result);
      if (result && result.data && result.data.updatedSection) {
        const updatedCourseContent = course.courseContent.map((section) =>
          section._id === modalData ? result.data.updatedSection : section
        );
  
        dispatch(setCourse({ ...course, courseContent: updatedCourseContent }));
  
        setModalData(null);
        toast.success("Lecture added successfully");
      } else {
        throw new Error(result.data?.message || "Unexpected response structure");
      }
    } catch (error) {
      console.error("Error creating subsection:", error.message);
      toast.error(error.message || "Failed to create subsection");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          <Upload
  name="lectureVideo"
  label="Lecture Video"
  register={register}
  setValue={setValue}
  errors={errors}
  video={true}
  viewData={view ? modalData.videoUrl : null}
  editData={edit ? modalData.videoUrl : null}
  selectedFile={selectedFile}
  setSelectedFile={setSelectedFile}
  previewSource={previewSource}             // Add this line
  setPreviewSource={setPreviewSource}       // Add this line
/>

          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
 
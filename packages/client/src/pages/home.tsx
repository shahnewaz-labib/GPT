import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { axiosClient } from "@/config/axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UserData {
  metadata: {
    name: string;
    studentId: string;
  };
}

interface ClassmatesMap {
  [group: string]: UserData[];
}

function createClassmatesMap(classmates: any[]): ClassmatesMap {
  const classmatesMap: ClassmatesMap = {};
  for (const classmate of classmates) {
    const group = Math.floor(classmate.id / 100).toString();
    if (!classmatesMap[group]) classmatesMap[group] = [];

    const { id, name } = classmate;
    classmatesMap[group].push({ metadata: { studentId: id, name } });
  }
  return classmatesMap;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [allClassmates, setAllClassmates] = useState<any>(null);

  useEffect(() => {
    axiosClient.get("/user/data").then((res) => {
      setUserData(res.data);
      window.localStorage.setItem("id", res.data.metadata.studentId);
      window.localStorage.setItem("name", res.data.metadata.name);
    });

    axiosClient.get(`/student/classmate/list`).then((res) => {
      setAllClassmates(res.data.students);
    });
  }, []);

  return (
    <div className="m-6 flex justify-center">
      {userData && allClassmates ? (
        <div>
          <div className="mx-auto w-full p-4 text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              <code>Hello, {userData.metadata.name}</code>
              <br />
              <code className="text-2xl">
                Time to vote for your fellow classmates' nicknames!
              </code>
            </h1>
          </div>

          <div className="flex items-center justify-center">
            <Carousel className="h-full w-80 md:w-11/12">
              <CarouselContent>
                {Object.values(createClassmatesMap(allClassmates)).map(
                  (cse1, index) => (
                    <CarouselItem key={index}>
                      <div className="space-y-4 p-1">
                        <Card className="bg-sky-300">
                          <CardContent className="mt-4 grid grid-rows-8 gap-4 md:grid-cols-5">
                            {cse1.map((student, index) => (
                              <Link
                                to={`/users/${student.metadata.studentId}`}
                                target="_blank"
                              >
                                <Card
                                  key={index}
                                  className="hover:drop-shadow-lg md:h-32"
                                >
                                  <CardHeader className="p-2 font-semibold md:p-4">
                                    {student.metadata.studentId}
                                  </CardHeader>
                                  <CardContent className="p-2 md:p-4 md:pt-1">
                                    <code>{student.metadata.name}</code>
                                  </CardContent>
                                </Card>
                              </Link>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  )
                )}
              </CarouselContent>
              <CarouselPrevious className="h-12 w-12 bg-sky-900 text-white" />
              <CarouselNext className="h-12 w-12 bg-sky-900 text-white" />
            </Carousel>
          </div>
        </div>
      ) : (
        <div className="animate-bounce text-xl">Loading....</div>
      )}
    </div>
  );
}

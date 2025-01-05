import { fetchAllCases, fetchAllUserCases } from "@/lib/data";
import { ViewCaseDetails } from "../ui/Cases/buttons";
import { formatEpochToLocal } from "@/lib/utils";
import UserDetails from "../ui/Cases/UserDetails";
import PerpetratorDetails from "../ui/Cases/PerpetratorDetails";
import CaseStatus from "../ui/Cases/CaseStatus";
import { cookies } from "next/headers";
import Empty from "../ui/Empty";

export default async function AllCasesTable({ query, currentPage }) {
  cookies();
  const cases = await fetchAllUserCases(query, currentPage);
  // const cases = await fetchAllCases(query, currentPage);


  if (!cases?.length) {
    return (
      <section
        className={`mb-4 mt-6  p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light`}
      >
    
          <div className="flex items-center justify-center">
            <Empty />
          </div>

      </section>
    );
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-surface p-2 md:pt-0">
          <div className="md:hidden">
            {cases?.map(
              ({ $id, victim, perpetrator, lawyer, $createdAt, status }) => (
                <div
                  key={$id}
                  className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <p>{victim}</p>
                      </div>
                      <p className="text-sm text-gray-500">{victim}</p>
                    </div>
                    {status}
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{lawyer}</p>
                      <p>{formatEpochToLocal($createdAt)}</p>
                    </div>
                    <div className="flex justify-end gap-2">
                      <ViewCaseDetails id={$id} />
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table  ">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Victim Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Victim Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Perpetrator
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Lawyer
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {cases?.map(
                ({ $id, victim, perpetrator, lawyer, $createdAt, status }) => {
                  return (
                    <tr
                      key={$id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <UserDetails userId={victim} show={"name"} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <UserDetails userId={victim} show={"email"} />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <PerpetratorDetails
                          userId={perpetrator}
                          show={"name"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <UserDetails userId={lawyer} show={"name"} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatEpochToLocal($createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <CaseStatus status={status} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 ">
                        <div className="flex justify-end gap-3">
                          <div className="flex justify-start gap-3">
                            <ViewCaseDetails id={$id} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

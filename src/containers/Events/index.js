import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
console.log("type", type)
  // const filteredEvents = (
  //   (!type
  //     ? data?.events
  //     : data?.events) || []
  // ).filter((event, index) => {
  //   if (
  //     (currentPage - 1) * PER_PAGE <= index &&
  //     PER_PAGE * currentPage > index
  //   ) {
  //     return true;
  //   }
  //   return false;
  // });

  const filteredEvents = (
    data?.events || []
    ).filter((event, index) => {
    const eventMatchesType = !type || event.type === type; 
    console.log("yo",eventMatchesType)
    // vérif de si l'événement correspond au type sélectionné
    const eventIsInCurrentPage = index >= (currentPage - 1) * PER_PAGE && index < currentPage * PER_PAGE; 
    // vérif de si l'événement est sur la page actuelle
  
    return eventMatchesType && eventIsInCurrentPage;
  });
console.log(filteredEvents)
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
    console.log("evt type",evtType)
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => ( 
              // console.log(value)
              value ? changeType(value) : changeType(null)
      )}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;

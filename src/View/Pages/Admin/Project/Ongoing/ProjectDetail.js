import { LeftCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import Holder from 'holderjs';
import { Image, Spin, message } from 'antd';
import Datatable from '../../../../Components/Datatable';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [land, setLand] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingWorkReport, setLoadingWorkReport] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);
  const [workReports, setWorkReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    fetchProject();
    fetchSentWorkOffers();
    fetchWorkReports();
    Holder.run();
  }, []);

  const headers = [
    {
      prop: "worker",
      title: "Worker",
      cell: (row) => (
        <div>
          <img
            src={row.worker.profilePictureUrl ? `${config.api.workerService}/images/${row.worker.profilePictureUrl}` : "https://placehold.co/50x50"}
            alt="Placeholder"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          {row.worker.name}
        </div>
      )
    },
    {
      prop: "week",
      title: "Week",
      isFilterable: true,
      isSortable: true,
      cell: (row) => renderWeekRange(row.week)
    },
    {
      prop: "description",
      title: "Description"
    },
    {
      prop: "proof",
      title: "Proof",
      cell: (row) => (
        <a href={`//${row.proof}`} target="_blank" rel="noopener noreferrer">
          View Proof
        </a>
      )
    },
    {
      prop: "status",
      title: "Status",
      cell: (row) => (
        <>
          {row.status === "PENDING" ? (
            <>
              <Button variant="success" className='me-2' onClick={() => verifyReport(row.id, "ACCEPTED")}>Accept</Button>
              <Button variant="danger" onClick={() => handleOpenModal(row)}>Reject</Button>
            </>
          ) : (
            <>
              <Badge bg={row.status === "ACCEPTED" ? "success" : "danger"}>
                {row.status}
              </Badge>
              <br />
              <Button variant="primary" onClick={() => verifyReport(row.id, "PENDING")}>Reset</Button>
            </>
          )}
        </>
      )
    }
  ];

  const handleOpenModal = (row) => {
    setSelectedReport(row);
    setShowModal(true)
    const workReport = workReports.find((workReport) => workReport.week === row.week);
    setImagePreview(`${config.api.workerService}/images/${workReport.proof}`);
  };

  const fetchProject = async () => {
    try {
      setLoadingProject(true);

      const response = await fetch(`${config.api.projectService}/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const projectData = await response.json();

      if (projectData) {
        if (projectData.initiatedAt) {
          projectData.initiatedAtReadable = new Date(projectData.initiatedAt).toLocaleDateString('id-ID', dateOptions);
        }
        if (projectData.estimatedFinished) {
          projectData.estimatedFinishedReadable = new Date(projectData.estimatedFinished).toLocaleDateString('id-ID', dateOptions);
        }
        setProject(projectData);
        const landResponse = await fetch(`${config.api.landService}/lands/${projectData.landId}`, {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
        const landData = await landResponse.json();
        setLand(landData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchSentWorkOffers = async () => {
    try {
      const response = await fetch(
        `${config.api.workerService}/admin/work-offers?filter[projectId]=${id}&filter[status]=ACCEPTED&filter[workContractAccepted]=1`
        , {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
      const data = await response.json();
      setAvailableWorkers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchWorkReports = async () => {
    try {
      setLoadingWorkReport(true);
      const response = await fetch(
        `${config.api.workerService}/admin/work-reports?filter[projectId]=${id}&include=worker`
        , {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
      const data = await response.json();
      setWorkReports(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingWorkReport(false);
    }
  };

  const verifyReport = async (id, status) => {
    try {
      let inputData = {status}
      if (status === "REJECTED") {
        inputData.rejectionMessage = rejectionMessage;
      }
      console.log(JSON.stringify(inputData));
      const response = await fetch(`${config.api.workerService}/admin/work-reports/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inputData)
      });

      if (response.ok) {
        if (status === "PENDING") {
          message.success("Status laporan kerja berhasil direset");
        } else {
          message.success("Laporan kerja berhasil diverifikasi");
        }
        fetchWorkReports();
      } else {
        const responseBody = await response.json();
        message.error(`Gagal memperbarui status laporan kerja: ${responseBody}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSelectedReport(null);
      setRejectionMessage("");
      setShowModal(false);
    }
  };

  const renderWeekRange = (week) => {
    if (!(project && project.initiatedAt)) {
      return "N/A";
    }

    const start = new Date(project.initiatedAt);

    const startOfWeek = new Date(start.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

    if (startOfWeek.getDay() === 0) {
      // If initiatedAt is a Sunday, adjust the first week range to be 8 days
      const adjustedEndOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
      return renderWeekRangeString(startOfWeek, adjustedEndOfWeek, week - 1);
    }

    return renderWeekRangeString(startOfWeek, endOfWeek, week - 1);
  };

  const renderWeekRangeString = (startOfWeek, endOfWeek, i) => {
    const startDate = startOfWeek.toLocaleDateString('id-ID', dateOptions);
    const endDate = endOfWeek.toLocaleDateString('id-ID', dateOptions);
    const startMonth = startOfWeek.getMonth();
    const endMonth = endOfWeek.getMonth();
    const startYear = startOfWeek.getFullYear();
    const endYear = endOfWeek.getFullYear();

    let weekCount = `Minggu ${i + 1} `;
    let weekRange = ``;
    if (startMonth === endMonth && startYear === endYear) {
      weekRange = `${startOfWeek.getDate()} - ${endDate}`;
    } else if (startMonth === endMonth) {
      weekRange = `${startDate} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleString('id-ID', { month: 'short' })}`;
    } else if (startYear === endYear) {
      weekRange = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('id-ID', { month: 'short' })} - ${endDate}`;
    } else {
      weekRange = `${startDate} - ${endDate}`;
    }
    return weekCount + '(' + weekRange + ')';
  };


  const handleCloseModal = () => {
    setSelectedReport(null);
    setShowModal(false);
    setImagePreview(null);
  };

  return (
    <>
      <Card>
        <Link to="/admin/projects/ongoing" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <LeftCircleOutlined style={{ marginRight: '5px' }} />
          <span>Kembali ke Daftar Proyek</span>
        </Link>
        <Card.Body>
          {loadingProject ? (
            <Spin />
          ) : (
            project && land && (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://placehold.co/600x400"
                    alt="Placeholder"
                    style={{ marginRight: '10px', maxWidth: '300px', maxHeight: '300px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <Card.Title>{land.street}, {land.city}</Card.Title>
                    <Card.Text>
                      <strong>Status:</strong> {project.status}<br />
                      <strong>Masa Proyek:</strong> {`${project.initiatedAtReadable ?? 'N/A'} - ${project.estimatedFinishedReadable ?? 'N/A'}`}<br />
                      <strong>Kebutuhan Pekerja:</strong> {project.workerNeeds}<br />
                      <strong>Deskripsi:</strong> {project.description}<br />
                    </Card.Text>
                  </div>
                </div>
              </>
            )
          )}
        </Card.Body>

        <Card.Footer>
          {loadingWorkReport ? (
            <Spin />
          ) : (
            <>
              <strong>Work Progress:</strong>
              <Datatable data={workReports} headers={headers} />
            </>
          )}
        </Card.Footer>
      </Card>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Tolak Laporan Pekerjaan
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            selectedReport && (
              <>
                <h6><strong>{renderWeekRange(selectedReport.week)}</strong></h6>
                <h6>
                  <strong>Deskripsi:</strong>
                  <br />
                  {selectedReport.description}
                </h6>
                <h6>
                  <strong>Bukti:</strong>
                  <br />
                  {loadingImage ? (
                    <Spin />
                  ) : (
                    <Image
                      className='mt-2'
                      src={selectedReport.proof ? `${config.api.workerService}/images/${selectedReport.proof}` : ''}
                      fluid
                      style={{ maxWidth: "100px" }}
                      onLoad={() => setLoadingImage(false)}
                      onError={() => setLoadingImage(false)} />
                  )}
                </h6>
              </>
            )
          }
          <Form encType="multipart/form-data">
            <Form.Group
              className="mb-3"
              controlId="formDescription"
            >
              <Form.Label><strong>Alasan Penolakan</strong></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name='rejectionMessage'
                onChange={(event) => setRejectionMessage(event.target.value)}
                defaultValue={rejectionMessage}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="primary" onClick={() => verifyReport(selectedReport.id, "REJECTED")}>
            Tolak Laporan
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectDetail;
